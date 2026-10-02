import React, { useState } from 'react';
import { View, Text, Image, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Wrap, Label, H, P, Btn, Reveal, Tap, useWide } from '../components/ui';
import { C, F } from '../lib/theme';
import { PRODUCTS, eur } from '../lib/data';
import { useCart } from '../lib/cart';
import { sendOrder } from '../lib/api';
export const inp = { borderWidth: 1, borderColor: C.line, borderRadius: 30, paddingHorizontal: 18, height: 48, fontFamily: F.sans, color: C.brown, backgroundColor: '#fff' } as const;
export default function Cart() {
  const r = useRouter(); const wide = useWide(); const { lines, subtotal, discount, coupon, applyCoupon, setQty, clear } = useCart();
  const [code, setCode] = useState(''); const [msg, setMsg] = useState(''); const [co, setCo] = useState(false);
  const [f, setF] = useState({ nome: '', email: '', telefono: '', indirizzo: '' }); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const total = subtotal - discount;
  const confirm = async () => {
    if (!f.nome.trim() || !/\S+@\S+\.\S+/.test(f.email) || !f.indirizzo.trim()) return setErr('Inserisci nome, email valida e indirizzo.');
    setErr(''); setBusy(true);
    try { await sendOrder({ ...f, coupon, totale: total, righe: lines }); clear(); setDone(true); } catch { setErr('Invio non riuscito, riprova.'); }
    setBusy(false);
  };
  if (done) return <Page><Wrap style={{ paddingVertical: 100, alignItems: 'center' }}><Reveal style={{ alignItems: 'center' }}><Label>Ordine ricevuto</Label><H size={44} style={{ marginVertical: 14, textAlign: 'center' }}>Grazie per il tuo ordine!</H><P style={{ textAlign: 'center' }}>Ti contatteremo via email per confermare dettagli e spedizione.</P><Btn title="Torna alla home" outer={{ marginTop: 24 }} onPress={() => r.push('/')} /></Reveal></Wrap></Page>;
  return (
    <Page>
      <Wrap style={{ paddingTop: 70, flexDirection: wide ? 'row' : 'column', gap: 36, alignItems: 'flex-start' }}>
        <View style={{ flex: wide ? 1.6 : undefined, width: '100%' }}>
          <Label>Il tuo ordine</Label><H size={58} style={{ marginVertical: 14 }}>Carrello</H>
          {!lines.length && <View><P>Il carrello è vuoto.</P><Btn title="Scopri le creazioni" outer={{ alignSelf: 'flex-start', marginTop: 16 }} onPress={() => r.push({ pathname: '/', params: { s: 'catalogo', t: String(Date.now()) } })} /></View>}
          {lines.map(l => { const p = PRODUCTS.find(x => x.id === l.id)!; return (
            <Reveal key={l.key} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 30, padding: 16, flexDirection: 'row', gap: 16, marginBottom: 14 }}>
              <Image source={p.img} style={{ width: 110, height: 110, borderRadius: 18, backgroundColor: C.bg2 }} resizeMode="contain" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.serif, fontSize: 22, color: C.brown }}>{p.name}</Text>
                <Text style={{ fontFamily: F.sans, color: C.text, marginTop: 4 }}>{eur(p.price)} cad.</Text>{!!l.note && <Text style={{ fontFamily: F.sans, fontSize: 13, fontStyle: 'italic', color: C.accent, marginTop: 4 }}>Incisione: "{l.note}"</Text>}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 }}>
                  <Tap onPress={() => setQty(l.key, l.qty - 1)} style={q}><Text style={{ color: C.brown }}>–</Text></Tap><Text style={{ fontFamily: F.sansS, color: C.brown }}>{l.qty}</Text><Tap onPress={() => setQty(l.key, l.qty + 1)} style={q}><Text style={{ color: C.brown }}>+</Text></Tap>
                  <Pressable onPress={() => setQty(l.key, 0)}><Text style={{ fontFamily: F.sans, color: C.text }}>Rimuovi</Text></Pressable>
                </View>
              </View>
              <Text style={{ fontFamily: F.sansB, fontSize: 18, color: C.brown }}>{eur(p.price * l.qty)}</Text>
            </Reveal>); })}
        </View>
        <Reveal style={{ flex: wide ? 1 : undefined, width: '100%', marginTop: wide ? 70 : 0 }}>
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 28 }}>
            <H size={32}>Riepilogo Ordine</H>
            <P style={{ fontSize: 14, marginVertical: 14 }}>Le creazioni personalizzate richiedono tempi di lavorazione artigianale. Imballiamo tutto con cura per garantire che arrivi in perfette condizioni.</P>
            <View style={{ flexDirection: 'row', gap: 8 }}><TextInput value={code} onChangeText={setCode} placeholder="Codice sconto" placeholderTextColor="#8C7A6E" autoCapitalize="characters" style={[inp, { flex: 1 }]} /><Btn kind="outline" title="Applica" onPress={() => setMsg(applyCoupon(code) ? 'Sconto 10% applicato!' : 'Codice non valido')} /></View>
            {!!msg && <Text style={{ fontFamily: F.sans, fontSize: 13, color: C.accent, marginTop: 8 }}>{msg} (prova NOVELO10)</Text>}
            <Row a="Subtotale stimato" b={eur(subtotal)} />{discount > 0 && <Row a="Sconto" b={'– ' + eur(discount)} />}{discount > 0 && <Row a="Totale" b={eur(total)} bold />}
            <P style={{ fontSize: 14, marginVertical: 12 }}>Spese di spedizione e dettagli verranno confermati al checkout.</P>
            {co && lines.length > 0 && <View style={{ gap: 10, marginBottom: 14 }}>
              <TextInput placeholder="Nome e cognome" value={f.nome} onChangeText={v => setF({ ...f, nome: v })} style={inp} />
              <TextInput placeholder="Email" autoCapitalize="none" keyboardType="email-address" value={f.email} onChangeText={v => setF({ ...f, email: v })} style={inp} />
              <TextInput placeholder="Telefono (opzionale)" value={f.telefono} onChangeText={v => setF({ ...f, telefono: v })} style={inp} />
              <TextInput placeholder="Indirizzo di spedizione" value={f.indirizzo} onChangeText={v => setF({ ...f, indirizzo: v })} style={inp} />
              {!!err && <Text style={{ color: '#b3261e', fontFamily: F.sans }}>{err}</Text>}
            </View>}
            <Btn disabled={!lines.length || busy} title={busy ? 'Invio…' : co ? 'Conferma ordine' : 'Procedi al Checkout'} onPress={() => co ? confirm() : setCo(true)} />
            <Pressable onPress={() => r.push('/')} style={{ marginTop: 16 }}><Text style={{ textAlign: 'center', fontFamily: F.sansS, color: C.text }}>Continua gli acquisti</Text></Pressable>
          </View>
        </Reveal>
      </Wrap>
    </Page>
  );
}
const q = { width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' } as const;
const Row = ({ a, b, bold }: any) => <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 }}><Text style={{ fontFamily: bold ? F.sansB : F.sans, color: C.text }}>{a}</Text><Text style={{ fontFamily: F.sansB, color: C.brown }}>{b}</Text></View>;
