import { useCallback, useRef, useState } from 'react';

export function useTurnstile() {
  const [token, setToken] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const current = useRef('');
  const onToken = useCallback((value: string) => { current.current = value; setToken(value); }, []);
  const consumeToken = () => {
    const value = current.current;
    current.current = '';
    setToken('');
    return value;
  };
  const reset = () => { onToken(''); setResetKey(value => value + 1); };
  return { token, onToken, consumeToken, resetKey, reset };
}
