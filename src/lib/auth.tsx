import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL, request, setAuthToken } from './api';
import { storage } from './storage';
export type User = { id?: number; name: string; email: string };
type Ctx = { user: User | null; loading: boolean; login: (email: string, password: string, turnstileToken: string) => Promise<void>; register: (name: string, email: string, password: string, confirm: string, turnstileToken: string) => Promise<void>; logout: () => Promise<void> };
const Cx = createContext<Ctx>(null as any);
export const useAuth = () => useContext(Cx);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  const save = async (t: string | null, u: User | null) => {
    setAuthToken(t); setUser(u);
    if (t && u) { await storage.set('nl-token', t); await storage.set('nl-user', JSON.stringify(u)); } else { await storage.del('nl-token'); await storage.del('nl-user'); }
  };
  useEffect(() => { (async () => {
    try {
      const t = await storage.get('nl-token'); const u = await storage.get('nl-user');
      if (t && u) {
        setAuthToken(t); setUser(JSON.parse(u));
        if (API_URL) { try { setUser(await request('GET', '/user')); } catch (e: any) { if (e.status === 401) await save(null, null); } }
      }
    } catch {}
    setLoading(false);
  })(); }, []);
  const v = useMemo<Ctx>(() => ({
    user, loading,
    login: async (email, password, turnstileToken) => {
      if (!API_URL) { await request('POST', '/login'); return save('demo', { name: email.split('@')[0], email }); }
      const d = await request('POST', '/login', { email, password, 'cf-turnstile-response': turnstileToken }); await save(d.token, d.user);
    },
    register: async (name, email, password, confirm, turnstileToken) => {
      if (!API_URL) { await request('POST', '/register'); return save('demo', { name, email }); }
      const d = await request('POST', '/register', { name, email, password, password_confirmation: confirm, 'cf-turnstile-response': turnstileToken }); await save(d.token, d.user);
    },
    logout: async () => { try { if (API_URL) await request('POST', '/logout'); } catch {} await save(null, null); },
  }), [user, loading]);
  return <Cx.Provider value={v}>{children}</Cx.Provider>;
}
