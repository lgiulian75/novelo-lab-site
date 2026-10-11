import Turnstile from '../components/Turnstile';
import { useTurnstile } from '../hooks/use-turnstile';
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Page, Wrap, Label, H, P, Btn, Reveal, Tap, useWide } from '../components/ui';
import { C, F, inp } from '../lib/theme';
import { sendContact } from '../lib/api';
const WA = '393280299137';
export default function Contatti() {
  const captcha = useTurnstile();
  const wide = useWide(); const [f, setF] = useState({ nome: '', email: '', telefono: '', messaggio: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const set = (k: string) => (v: string) => { setF({ ...f, [k]: v }); setErr(''); };
  const send = async () => {
    if (!f.nome.trim() || !/\S+@\S+\.\S+/.test(f.email) || f.messaggio.trim().length < 5) return setErr('Inserisci nome, email valida e un messaggio.');
    if (busy) return;
    const turnstileToken = captcha.consumeToken();
    if (!turnstileToken) return setErr('Completa la verifica di sicurezza.');
    setBusy(true);
    try { await sendContact({ ...f, 'cf-turnstile-response': turnstileToken }); setDone(true); } catch (e: any) { setErr(e.message || 'Invio non riuscito, riprova.'); }
    captcha.reset();
    setBusy(false);
  };
  const Fld = ({ l, req, children }: any) => <View style={{ flex: 1, minWidth: 220, gap: 8 }}><Text style={{ fontFamily: F.sansB, fontSize: 14, color: C.brown }}>{l}{req && <Text style={{ color: C.accent }}> *</Text>}</Text>{children}</View>;
  return (
    <Page>
      <Wrap style={{ paddingTop: 70, maxWidth: 820 }}>
        <Reveal style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: wide ? 40 : 24 }}>
          {done ? <View style={{ alignItems: 'center', paddingVertical: 50 }}><Ionicons name="checkmark-circle" size={48} color={C.accent} /><H size={32} style={{ textAlign: 'center', marginTop: 12 }}>Messaggio inviato!</H><P style={{ textAlign: 'center', marginTop: 10 }}>Ti risponderemo il prima possibile all'indirizzo email indicato.</P></View> : <>
            <Label>Contatta il negozio</Label><H size={wide ? 44 : 34} style={{ marginVertical: 12 }}>Scrivi a NoveloLab</H>
            <P style={{ fontSize: 16 }}>Invia una richiesta al negozio: ti risponderemo direttamente all'indirizzo e-mail indicato.</P>
            <Tap onPress={() => Linking.openURL(`https://wa.me/${WA}?text=${encodeURIComponent('Ciao NoveloLab, vorrei informazioni.')}`)} outer={{ alignSelf: 'flex-start', marginVertical: 22 }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.brown, borderRadius: 40, paddingVertical: 14, paddingHorizontal: 24 }}>
              <Ionicons name="logo-whatsapp" size={22} color="#fff" /><Text style={{ fontFamily: F.sansB, color: '#fff', fontSize: 15 }}>Contattaci su WhatsApp</Text>
            </Tap>
            <View style={{ gap: 18 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
                <Fld l="Nome e cognome" req><TextInput value={f.nome} onChangeText={set('nome')} style={inp} placeholder="Il tuo nome" placeholderTextColor="#8C7A6E" /></Fld>
                <Fld l="E-mail" req><TextInput value={f.email} onChangeText={set('email')} style={inp} placeholder="La tua email" placeholderTextColor="#8C7A6E" autoCapitalize="none" keyboardType="email-address" /></Fld>
              </View>
              <Fld l="Telefono"><TextInput value={f.telefono} onChangeText={set('telefono')} style={inp} placeholder="Opzionale" placeholderTextColor="#8C7A6E" keyboardType="phone-pad" /></Fld>
              <Fld l="Messaggio" req><TextInput multiline value={f.messaggio} onChangeText={set('messaggio')} placeholder="Come possiamo aiutarti?" placeholderTextColor="#8C7A6E" style={[inp, { height: 140, paddingTop: 14, borderRadius: 24, textAlignVertical: 'top' }]} /></Fld>
              <Turnstile action="contact" onToken={captcha.onToken} resetKey={captcha.resetKey} />
              {!!err && <Text style={{ color: '#b3261e', fontFamily: F.sans }}>{err}</Text>}
              <Tap onPress={busy || !captcha.token ? undefined : send} outer={{ alignSelf: 'flex-start' }} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.brown, borderRadius: 40, paddingVertical: 15, paddingHorizontal: 28, opacity: busy || !captcha.token ? 0.6 : 1 }}><Ionicons name="paper-plane-outline" size={20} color="#fff" /><Text style={{ fontFamily: F.sansB, color: '#fff', fontSize: 15 }}>{busy ? 'Invio…' : 'Invia messaggio'}</Text></Tap>
            </View>
          </>}
        </Reveal>
      </Wrap>
    </Page>
  );
}
