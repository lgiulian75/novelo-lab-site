import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
const K = 'novelolab-fav';
type Ctx = { ids: string[]; has: (id: string) => boolean; toggle: (id: string) => void };
const Cx = createContext<Ctx>(null as any);
export const useFav = () => useContext(Cx);
export function FavProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { try { const v = (globalThis as any).localStorage?.getItem(K); if (v) setIds(JSON.parse(v)); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { (globalThis as any).localStorage?.setItem(K, JSON.stringify(ids)); } catch {} }, [ids, ready]);
  const v = useMemo<Ctx>(() => ({ ids, has: id => ids.includes(id), toggle: id => setIds(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]) }), [ids]);
  return <Cx.Provider value={v}>{children}</Cx.Provider>;
}
