import React, { useEffect, useRef, useState } from 'react';
import type { TurnstileProps } from './Turnstile';

type TurnstileAPI = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: TurnstileAPI } }
const sitekey = process.env.EXPO_PUBLIC_TURNSTILE_SITE_KEY;
let loading: Promise<TurnstileAPI> | undefined;

function loadTurnstile(): Promise<TurnstileAPI> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (!loading) {
    loading = new Promise<TurnstileAPI>((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { script.remove(); reject(new Error('Turnstile non disponibile')); };
      const timer = window.setTimeout(fail, 15000);
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.onload = () => {
        window.clearTimeout(timer);
        if (window.turnstile) resolve(window.turnstile);
        else fail();
      };
      script.onerror = () => { window.clearTimeout(timer); fail(); };
      document.head.appendChild(script);
    }).catch(error => { loading = undefined; throw error; });
  }
  return loading;
}

export default function Turnstile({ action, onToken, resetKey }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(sitekey ? '' : 'Verifica di sicurezza non disponibile. Riprova più tardi.');
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    let widget: string | undefined;
    let api: TurnstileAPI | undefined;
    onToken('');
    if (!sitekey) return;
    const fail = (message: string) => { if (active) { onToken(''); setError(message); } };
    loadTurnstile().then(loaded => {
      if (!active || !container.current) return;
      setError('');
      api = loaded;
      widget = api.render(container.current, {
        sitekey, action, theme: 'light', size: 'flexible', language: 'it',
        'response-field': false,
        callback: (token: string) => { if (active) { onToken(token); setError(''); } },
        'expired-callback': () => fail('Verifica scaduta. Completa nuovamente il controllo.'),
        'timeout-callback': () => fail('Tempo scaduto. Riprova la verifica.'),
        'error-callback': () => { fail('Verifica non riuscita. Controlla la connessione e riprova.'); return true; },
      });
    }).catch(() => fail('Impossibile caricare la verifica. Controlla la connessione e riprova.'));
    return () => { active = false; if (widget !== undefined) api?.remove(widget); };
  }, [action, onToken, resetKey, retry]);
  return <div style={{ width: '100%', minWidth: 200 }}>
    <div ref={container} />
    {error && <div role="alert" style={{ color: '#b3261e', fontSize: 14, marginTop: 8 }}>
      {error} {sitekey && <button type="button" onClick={() => { setError(''); setRetry(value => value + 1); }}>Riprova verifica</button>}
    </div>}
  </div>;
}
