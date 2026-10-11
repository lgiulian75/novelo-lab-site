import Turnstile from './Turnstile';
import { useTurnstile } from '../hooks/use-turnstile';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Page, Wrap, Label, H, P, Btn, Reveal } from './ui';
import { C, F, inp } from '../lib/theme';
import { useAuth } from '../lib/auth';
export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const captcha = useTurnstile();
  const reg = mode === 'register'; const r = useRouter(); const { login, register } = useAuth(); const { next } = useLocalSearchParams<{ next?: string }>();
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' }); const [show, setShow] = useState(false); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: string) => (v: string) => { setF({ ...f, [k]: v }); setErr(''); };
  const submit = async () => {
    if (reg && !f.name.trim()) return setErr('Inserisci il tuo nome.');
    if (!/\S+@\S+\.\S+/.test(f.email)) return setErr('Inserisci un indirizzo email valido.');
    if (f.password.length < 8) return setErr('La password deve avere almeno 8 caratteri.');
    if (reg && f.password !== f.confirm) return setErr('Le password non coincidono.');
    if (busy) return;
    const turnstileToken = captcha.consumeToken();
    if (!turnstileToken) return setErr('Completa la verifica di sicurezza.');
    setBusy(true);
    try { reg ? await register(f.name.trim(), f.email.trim(), f.password, f.confirm, turnstileToken) : await login(f.email.trim(), f.password, turnstileToken); r.replace((next as any) || '/'); }
    catch (e: any) { setErr(e.message || 'Qualcosa è andato storto.'); }
    captcha.reset();
    setBusy(false);
  };
  const L = (t: string) => <Text style={{ fontFamily: F.sansS, fontSize: 12, letterSpacing: 3, color: C.brown, textTransform: 'uppercase', marginBottom: 8 }}>{t}</Text>;
  return (
    <Page>
      <Wrap style={{ paddingTop: 70, alignItems: 'center' }}>
        <Reveal style={{ width: '100%', maxWidth: 480 }}>
          <View style={{ alignItems: 'center', marginBottom: 28 }}><Label>{reg ? 'Nuovo account' : 'Bentornato'}</Label><H size={44} style={{ marginTop: 12, textAlign: 'center' }}>{reg ? 'Crea il tuo account' : 'Accedi'}</H><P style={{ textAlign: 'center', marginTop: 10 }}>{reg ? 'Salva i tuoi preferiti e ordina più velocemente.' : 'Accedi per ritrovare i tuoi dati e i tuoi ordini.'}</P></View>
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 28, gap: 16 }}>
            {reg && <View>{L('Nome')}<TextInput value={f.name} onChangeText={set('name')} placeholder="Nome e cognome" placeholderTextColor="#8C7A6E" style={inp} /></View>}
            <View>{L('Email')}<TextInput value={f.email} onChangeText={set('email')} placeholder="La tua email" placeholderTextColor="#8C7A6E" autoCapitalize="none" keyboardType="email-address" style={inp} /></View>
            <View>{L('Password')}
              <View><TextInput value={f.password} onChangeText={set('password')} placeholder="Almeno 8 caratteri" placeholderTextColor="#8C7A6E" secureTextEntry={!show} onSubmitEditing={reg ? undefined : submit} style={[inp, { paddingRight: 48 }]} />
                <Pressable onPress={() => setShow(!show)} hitSlop={8} style={{ position: 'absolute', right: 16, top: 14 }}><Ionicons name={show ? 'eye-off-outline' : 'eye-outline'} size={20} color={C.text} /></Pressable></View></View>
            {reg && <View>{L('Conferma password')}<TextInput value={f.confirm} onChangeText={set('confirm')} placeholder="Ripeti la password" placeholderTextColor="#8C7A6E" secureTextEntry={!show} onSubmitEditing={submit} style={inp} /></View>}
            <Turnstile action={mode} onToken={captcha.onToken} resetKey={captcha.resetKey} />
            {!!err && <Reveal><View style={{ flexDirection: 'row', gap: 8, backgroundColor: '#FBEDEA', borderRadius: 16, padding: 12 }}><Ionicons name="alert-circle" size={18} color="#B3261E" /><Text style={{ flex: 1, fontFamily: F.sans, color: '#B3261E' }}>{err}</Text></View></Reveal>}
            <Btn disabled={busy || !captcha.token} title={busy ? 'Attendi…' : reg ? 'Registrati' : 'Accedi'} onPress={submit} />
            <Pressable onPress={() => r.replace({ pathname: reg ? '/accedi' : '/registrati', params: next ? { next } : {} } as any)}><Text style={{ textAlign: 'center', fontFamily: F.sans, color: C.text }}>{reg ? 'Hai già un account? ' : 'Non hai un account? '}<Text style={{ fontFamily: F.sansB, color: C.brown, textDecorationLine: 'underline' }}>{reg ? 'Accedi' : 'Registrati'}</Text></Text></Pressable>
          </View>
        </Reveal>
      </Wrap>
    </Page>
  );
}
