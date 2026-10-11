import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, Share } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Page, Wrap, Label, H, P, Btn, Reveal, Tap, FavBtn, useWide } from '../../components/ui';
import Gallery from '../../components/Gallery';
import { C, F } from '../../lib/theme';
import { eur } from '../../lib/data';
import { useCatalog } from '../../lib/catalog';
import { useCart } from '../../lib/cart';
export default function Prodotto() {
  const { products: PRODUCTS, loading } = useCatalog();
  const { id } = useLocalSearchParams<{ id: string }>(); const r = useRouter(); const wide = useWide(); const { add } = useCart();
  const p = PRODUCTS.find(x => x.id === id);
  const [note, setNote] = useState(''); const [qty, setQty] = useState(1); const [added, setAdded] = useState(false); const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || !p) return;
    const id = setTimeout(() => { document.title = 'NoveloLab | ' + p.name; }, 80);
    return () => clearTimeout(id);
  }, [p?.name]);
  if (!p) return <Page><Wrap style={{ paddingTop: 80 }}><H size={36}>{loading ? 'Caricamento…' : 'Prodotto non trovato'}</H><Btn title="Torna al catalogo" outer={{ alignSelf: 'flex-start', marginTop: 20 }} onPress={() => r.push('/')} /></Wrap></Page>;
  const buy = () => { add(p.id, note, qty); setAdded(true); setTimeout(() => setAdded(false), 1800); };
  const share = async () => {
    const text = `${p.name} – NoveloLab`;
    try {
      if (Platform.OS === 'web') {
        const url = window.location.href; const nav: any = navigator;
        if (nav.share) await nav.share({ title: p.name, text, url });
        else { await nav.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
      } else await Share.share({ message: text });
    } catch {}
  };
  const q = { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' } as const;
  return (
    <Page>
      <Stack.Screen options={{ title: 'NoveloLab | ' + p.name }} />
      <Wrap style={{ paddingTop: 40 }}>
        <Pressable onPress={() => r.canGoBack() ? r.back() : r.push('/')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 24 }}><Ionicons name="arrow-back" size={16} color={C.text} /><Text style={{ fontFamily: F.sansS, color: C.text }}>Torna al catalogo</Text></Pressable>
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 50, alignItems: 'flex-start' }}>
          <Reveal style={{ flex: wide ? 1 : undefined, width: '100%' }}><Gallery imgs={p.imgs} /></Reveal>
          <Reveal delay={150} style={{ flex: wide ? 1 : undefined, width: '100%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Label style={{ flex: 1 }}>{p.cat}</Label>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {copied && <Text style={{ fontFamily: F.sansS, fontSize: 12, color: C.accent }}>Link copiato!</Text>}
                <FavBtn id={p.id} style={{ borderWidth: 1, borderColor: C.line, backgroundColor: 'transparent', width: 44, height: 44, borderRadius: 22 }} />
                <Tap onPress={share} style={q}><Ionicons name="share-social-outline" size={20} color={C.brown} /></Tap>
              </View>
            </View>
            <H size={wide ? 48 : 36} style={{ marginVertical: 14 }}>{p.name}</H>
            <Text style={{ fontFamily: F.sansB, fontSize: 24, color: C.brown, marginBottom: 14 }}>{eur(p.price)}</Text>
            <P>{p.desc}</P>
            <View style={{ marginVertical: 18, gap: 10 }}>
              {['Realizzato a mano nel nostro laboratorio', 'Incisione e personalizzazione su misura', 'Prezzo della creazione base: preventivo finale in base alla personalizzazione'].map(t => <View key={t} style={{ flexDirection: 'row', gap: 10 }}><Ionicons name="checkmark-circle" size={18} color={C.accent} /><Text style={{ flex: 1, fontFamily: F.sans, color: C.text }}>{t}</Text></View>)}
            </View>
            <Text style={{ fontFamily: F.sansS, fontSize: 12, letterSpacing: 3, color: C.brown, textTransform: 'uppercase', marginBottom: 8 }}>Personalizzazione</Text>
            <TextInput multiline value={note} onChangeText={setNote} placeholder="Testo da incidere: nomi, date, dedica…" placeholderTextColor="#8C7A6E" style={{ borderWidth: 1, borderColor: '#D9C9B8', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 14, height: 120, fontSize: 16, lineHeight: 24, fontFamily: F.sans, color: C.brown, backgroundColor: '#fff', textAlignVertical: 'top' }} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 20 }}>
              <Tap onPress={() => setQty(Math.max(1, qty - 1))} style={q}><Text style={{ color: C.brown }}>–</Text></Tap><Text style={{ fontFamily: F.sansS, color: C.brown, minWidth: 20, textAlign: 'center' }}>{qty}</Text><Tap onPress={() => setQty(qty + 1)} style={q}><Text style={{ color: C.brown }}>+</Text></Tap>
            </View>
            <Btn title={added ? 'Aggiunto ✓' : 'Aggiungi al carrello'} onPress={buy} />
            {added && <Reveal style={{ marginTop: 10 }}><Btn kind="outline" title="Vai al carrello" onPress={() => r.push('/cart')} /></Reveal>}
          </Reveal>
        </View>
      </Wrap>
    </Page>
  );
}
