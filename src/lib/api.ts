// Metti qui l'URL del backend Laravel, es. 'http://localhost:8000/api'. Vuoto = invio simulato.
export const API_URL = '';
async function post(path: string, body: any) {
  if (!API_URL) { await new Promise(r => setTimeout(r, 800)); return { ok: true }; }
  const r = await fetch(API_URL + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('Errore server');
  return r.json();
}
export const sendRequest = (b: any) => post('/richieste', b);
export const sendOrder = (b: any) => post('/ordini', b);
