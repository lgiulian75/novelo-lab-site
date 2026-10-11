import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_URL, request } from './api';
import { PRODUCTS as FALLBACK, CATS as FALLBACK_CATS, HERO, Product } from './data';
type Ctx = { products: Product[]; cats: string[]; loading: boolean; error: boolean; reload: () => void };
const Cx = createContext<Ctx>(null as any);
export const useCatalog = () => useContext(Cx);
// Vecchi id (p1, p2…) salvati nel browser → id del database, abbinati per nome. Se non esiste più, null.
export const migrateId = (id: string, products: Product[]): string | null =>
  products.some(p => p.id === id) ? id : (products.find(p => p.name === FALLBACK.find(f => f.id === id)?.name)?.id ?? null);
const map = (p: any): Product => {
  const imgs = (p.imgs || []).map((u: string) => ({ uri: u })); const list = imgs.length ? imgs : [HERO];
  return { id: String(p.id), name: p.name, cat: p.cat, price: Number(p.price), desc: p.desc || '', img: list[0], imgs: list };
};
export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(API_URL ? [] : FALLBACK);
  const [cats, setCats] = useState<string[]>(API_URL ? [] : FALLBACK_CATS);
  const [loading, setLoading] = useState(!!API_URL); const [error, setError] = useState(false);
  const load = async () => {
    if (!API_URL) return;
    setLoading(true);
    try {
      const [p, c] = await Promise.all([request('GET', '/prodotti'), request('GET', '/categorie')]);
      setProducts(p.map(map)); setCats(c); setError(false);
    } catch { setError(true); setProducts(cur => cur.length ? cur : FALLBACK); setCats(cur => cur.length ? cur : FALLBACK_CATS); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  return <Cx.Provider value={{ products, cats, loading, error, reload: load }}>{children}</Cx.Provider>;
}
