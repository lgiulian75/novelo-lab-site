import { Platform } from 'react-native';
// Metti qui l'URL del backend Laravel, es. 'http://localhost:8000/api'. Vuoto = modalità demo (nessuna chiamata reale).
export const API_URL = 'http://localhost:8000/api';
let token: string | null = null;
export const setAuthToken = (t: string | null) => { token = t; };
export async function request(method: string, path: string, body?: any) {
  if (!API_URL) { await new Promise(r => setTimeout(r, 700)); return { ok: true, demo: true } as any; }
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  const headers: any = { Accept: 'application/json' };
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = 'Bearer ' + token;
  let res: Response;
  try { res = await fetch(API_URL + path, { method, headers, body: body ? (isForm ? body : JSON.stringify(body)) : undefined }); }
  catch { throw new Error('Server non raggiungibile. Controlla la connessione e API_URL.'); }
  const data: any = await res.json().catch(() => ({}));
  if (!res.ok) {
    const first = data.errors ? (Object.values(data.errors)[0] as string[])[0] : null;
    const e: any = new Error(first || data.message || 'Errore del server'); e.status = res.status; throw e;
  }
  return data;
}
// Costruisce un modulo con campi e file (le foto vengono davvero inviate)
export async function toForm(fields: Record<string, string>, files: { uri: string; name: string; type?: string }[] = []) {
  const fd = new FormData();
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ''));
  for (const f of files) {
    if (Platform.OS === 'web') fd.append('foto[]', await (await fetch(f.uri)).blob(), f.name);
    else fd.append('foto[]', { uri: f.uri, name: f.name, type: f.type || 'image/jpeg' } as any);
  }
  return fd;
}
export const sendRequest = (b: any) => request('POST', '/richieste', b);
export const sendContact = (b: any) => request('POST', '/contatti', b);
export const sendOrder = (b: any) => request('POST', '/ordini', b);
