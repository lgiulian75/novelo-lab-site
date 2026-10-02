import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from './data';
type Line = { key: string; id: string; qty: number; note: string };
type Ctx = { lines: Line[]; count: number; subtotal: number; discount: number; coupon: string; applyCoupon: (c: string) => boolean; add: (id: string, note?: string, qty?: number) => void; setQty: (key: string, q: number) => void; clear: () => void };
const K = 'novelolab-cart';
const Cx = createContext<Ctx>(null as any);
export const useCart = () => useContext(Cx);
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]); const [coupon, setCoupon] = useState(''); const [ready, setReady] = useState(false);
  useEffect(() => { try { const v = (globalThis as any).localStorage?.getItem(K); if (v) setLines(JSON.parse(v)); } catch {} setReady(true); }, []);
  useEffect(() => { if (ready) try { (globalThis as any).localStorage?.setItem(K, JSON.stringify(lines)); } catch {} }, [lines, ready]);
  const v = useMemo<Ctx>(() => {
    const subtotal = lines.reduce((s, l) => s + l.qty * (PRODUCTS.find(p => p.id === l.id)?.price ?? 0), 0);
    return {
      lines, subtotal, coupon, count: lines.reduce((s, l) => s + l.qty, 0), discount: coupon ? subtotal * 0.1 : 0,
      applyCoupon: c => { const ok = c.trim().toUpperCase() === 'NOVELO10'; setCoupon(ok ? 'NOVELO10' : ''); return ok; },
      add: (id, note = '', qty = 1) => setLines(ls => { const key = id + '|' + note.trim(); return ls.some(l => l.key === key) ? ls.map(l => l.key === key ? { ...l, qty: l.qty + qty } : l) : [...ls, { key, id, qty, note: note.trim() }]; }),
      setQty: (key, q) => setLines(ls => q <= 0 ? ls.filter(l => l.key !== key) : ls.map(l => l.key === key ? { ...l, qty: q } : l)),
      clear: () => { setLines([]); setCoupon(''); },
    };
  }, [lines, coupon]);
  return <Cx.Provider value={v}>{children}</Cx.Provider>;
}
