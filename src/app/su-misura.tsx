import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Page, Wrap, Label, H, P, Btn, Reveal, useWide } from '../components/ui';
import { C, F, inp } from '../lib/theme';
import { sendRequest, toForm } from '../lib/api';
const FileChip = ({ name, onRemove }: { name: string; onRemove: () => void }) => {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(a, { toValue: 1, useNativeDriver: true, bounciness: 8 }).start(); }, []);
  return (
    <Animated.View style={{ opacity: a, transform: [{ scale: a.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }], flexDirection: 'row', alignItems: 'center', gap: 8, maxWidth: '100%', backgroundColor: C.card, borderWidth: 1, borderColor: C.beige, borderRadius: 22, paddingVertical: 8, paddingLeft: 14, paddingRight: 8, shadowColor: '#5C4033', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } }}>
      <Ionicons name="image-outline" size={16} color={C.accent} />
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: F.sansS, fontSize: 13, color: C.brown }}>{name}</Text>
      <Pressable onPress={onRemove} hitSlop={8} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.bg2, alignItems: 'center', justifyContent: 'center' }}><Ionicons name="close" size={14} color={C.brown} /></Pressable>
    </Animated.View>
  );
};
const Fld = ({ l, children }: any) => <View style={{ flex: 1, minWidth: 200, gap: 8 }}><Text style={{ fontFamily: F.sansS, fontSize: 12, letterSpacing: 3, color: C.brown, textTransform: 'uppercase' }}>{l}</Text>{children}</View>;
export default function SuMisura() {
  const wide = useWide(); const [f, setF] = useState({ nome: '', email: '', telefono: '', materiale: 'Legno', nomi: '', date: '', descrizione: '' });
  const [foto, setFoto] = useState<{ id: string; name: string; uri: string; type: string }[]>([]); const [err, setErr] = useState(''); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const set = (k: string) => (v: string) => setF({ ...f, [k]: v });
  const pick = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, allowsMultipleSelection: true });
    if (!r.canceled) setFoto(l => [...l, ...r.assets.map((x, i) => ({ id: Date.now() + '-' + i, name: x.fileName || x.uri.split('/').pop() || 'foto', uri: x.uri, type: x.mimeType || 'image/jpeg' }))]);
  };
  const send = async () => {
    if (!f.nome.trim() || !/\S+@\S+\.\S+/.test(f.email) || f.descrizione.trim().length < 10) return setErr('Inserisci nome, email valida e una descrizione (almeno 10 caratteri).');
    setErr(''); setBusy(true);
    try { await sendRequest(await toForm(f, foto)); setDone(true); } catch { setErr('Invio non riuscito, riprova.'); }
    setBusy(false);
  };
  const B = ({ ic, t }: any) => <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}><Ionicons name={ic} size={18} color={C.accent} /><Text style={{ flex: 1, fontFamily: F.sans, color: C.text }}>{t}</Text></View>;
  return (
    <Page>
      <Wrap style={{ paddingTop: 80, flexDirection: wide ? 'row' : 'column', gap: 50, alignItems: 'flex-start' }}>
        <Reveal style={{ flex: wide ? 1 : undefined }}>
          <Label>Su misura per la tua famiglia</Label><H size={wide ? 56 : 40} style={{ marginVertical: 18 }}>Raccontaci la creazione che desideri</H>
          <P style={{ fontSize: 18 }}>Un nome, una data, una frase speciale: trasformiamo il tuo ricordo in un oggetto in legno o ardesia da custodire per sempre. Compila il modulo e il nostro laboratorio ti ricontatterà con una proposta personalizzata.</P>
          <View style={{ marginTop: 14 }}><B ic="pencil" t="Descrivi liberamente la tua idea: forma, dimensioni e dettagli che ami." /><B ic="leaf" t="Scegli il materiale tra legno naturale e ardesia elegante." /><B ic="image" t="Allega una foto di riferimento per guidarci nella realizzazione." /></View>
        </Reveal>
        <Reveal delay={150} style={{ flex: wide ? 1.2 : undefined, width: '100%' }}>
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 28, gap: 18 }}>
            {done ? <View style={{ alignItems: 'center', paddingVertical: 50 }}><H size={32} style={{ textAlign: 'center' }}>Richiesta inviata!</H><P style={{ textAlign: 'center', marginTop: 10 }}>Ti ricontatteremo presto con una proposta personalizzata.</P></View> : <>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}><Fld l="Il tuo nome"><TextInput placeholder="Nome e cognome" placeholderTextColor="#8C7A6E" value={f.nome} onChangeText={set('nome')} style={inp} /></Fld><Fld l="Email"><TextInput placeholder="La tua email" placeholderTextColor="#8C7A6E" autoCapitalize="none" keyboardType="email-address" value={f.email} onChangeText={set('email')} style={inp} /></Fld></View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}><Fld l="Telefono"><TextInput placeholder="Opzionale" placeholderTextColor="#8C7A6E" value={f.telefono} onChangeText={set('telefono')} style={inp} /></Fld>
                <Fld l="Materiale"><View style={{ flexDirection: 'row', gap: 8 }}>{['Legno', 'Ardesia'].map(m => <Pressable key={m} onPress={() => set('materiale')(m)} style={[inp, { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: f.materiale === m ? C.brown : '#fff' }]}><Text style={{ fontFamily: F.sansS, color: f.materiale === m ? '#fff' : C.brown }}>{m}</Text></Pressable>)}</View></Fld></View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}><Fld l="Nomi da incidere"><TextInput placeholder="Es. Marco e Giulia" placeholderTextColor="#8C7A6E" value={f.nomi} onChangeText={set('nomi')} style={inp} /></Fld><Fld l="Date da incidere"><TextInput placeholder="Es. 12.09.2025" placeholderTextColor="#8C7A6E" value={f.date} onChangeText={set('date')} style={inp} /></Fld></View>
              <Fld l="Descrivi la tua creazione"><TextInput multiline placeholder="Raccontaci cosa immagini: a chi è destinata, l'occasione, la forma e le frasi che vorresti incidere" placeholderTextColor="#8C7A6E" value={f.descrizione} onChangeText={set('descrizione')} style={[inp, { height: 120, paddingTop: 14, borderRadius: 24, textAlignVertical: 'top' }]} /></Fld>
              <Fld l="Foto di riferimento"><Pressable onPress={pick} style={[inp, { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 6 }]}><Text style={{ fontFamily: F.sansS, color: C.brown }}>Scegli file</Text><Text style={{ fontFamily: F.sans, color: C.text }}>{foto.length ? `${foto.length} ${foto.length === 1 ? 'file selezionato' : 'file selezionati'}` : 'Nessun file selezionato'}</Text></Pressable>{foto.length > 0 && <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{foto.map(x => <FileChip key={x.id} name={x.name} onRemove={() => setFoto(l => l.filter(y => y.id !== x.id))} />)}</View>}<Text style={{ fontFamily: F.sans, fontSize: 12, color: C.text }}>Facoltativa. Puoi caricare più foto: JPG, PNG o WEBP, fino a 10 MB.</Text></Fld>
              {!!err && <Text style={{ color: '#b3261e', fontFamily: F.sans }}>{err}</Text>}
              <Btn disabled={busy} title={busy ? 'Invio…' : 'Invia la tua richiesta'} onPress={send} />
            </>}
          </View>
        </Reveal>
      </Wrap>
    </Page>
  );
}
