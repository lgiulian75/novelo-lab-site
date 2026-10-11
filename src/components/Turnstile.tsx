import React from 'react';
import { Linking, Pressable, Text } from 'react-native';

export type TurnstileProps = {
  action: 'login' | 'register' | 'contact' | 'custom_request';
  onToken: (token: string) => void;
  resetKey: number;
};

// Il widget richiede un browser; nessuna esenzione lato API per i client nativi.
export default function Turnstile({ action }: TurnstileProps) {
  const pages = { login: 'accedi', register: 'registrati', contact: 'contatti', custom_request: 'su-misura' };
  return <Pressable accessibilityRole="link" onPress={() => Linking.openURL(`https://lab.novelo.it/${pages[action]}`)}>
    <Text>Per completare la verifica di sicurezza, apri questo modulo sul sito web.</Text>
  </Pressable>;
}
