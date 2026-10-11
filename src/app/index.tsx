import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Animated, Easing, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Page, Wrap, Label, H, P, Btn, Reveal, Anchor, Tap, useWide, useGrid } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { C, F } from '../lib/theme';
import { HERO } from '../lib/data';
import { useCatalog } from '../lib/catalog';

export default function Home() {
  const { products: PRODUCTS, cats: CATS, loading, error } = useCatalog();
  const r = useRouter(); const wide = useWide(); const { s, cat, t } = useLocalSearchParams<{ s?: string; cat?: string; t?: string }>();
  const [filter, setFilter] = useState('Tutte'); const ctx = useRef<any>(null);
  const g4 = useGrid(4), g5 = useGrid(5);
  const fl = useRef(new Animated.Value(0)).current; const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([Animated.timing(fl, { toValue: 1, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true }), Animated.timing(fl, { toValue: 0, duration: 2600, easing: Easing.inOut(Easing.sin), useNativeDriver: true })])).start();
    Animated.timing(fade, { toValue: 1, duration: 1000, useNativeDriver: true }).start();
  }, []);
  useEffect(() => {
    if (cat) setFilter(cat);
    if (s && ctx.current) { const id = s; setTimeout(() => ctx.current.go(id), 450); }
  }, [s, cat, t]);
  const list = PRODUCTS.filter(p => filter === 'Tutte' || p.cat === filter);
  const rise = (d: number) => ({ opacity: fade, transform: [{ translateY: fade.interpolate({ inputRange: [0, 1], outputRange: [30 + d, 0] }) }] });
  return (
    <Page onReady={c => { ctx.current = c; c.pos.__home = 0; }}>
      <Wrap style={{ flexDirection: wide ? 'row' : 'column', alignItems: 'center', paddingTop: 50, paddingBottom: 50, gap: 40 }}>
        <View style={{ flex: wide ? 1.1 : undefined }}>
          <Animated.View style={rise(0)}><Label>Fatto con amore</Label></Animated.View>
          <Animated.View style={[{ marginVertical: 18 }, rise(20)]}><H size={wide ? 76 : 46} style={{ lineHeight: wide ? 96 : 54 }}>Creazioni Uniche per la Tua Famiglia</H></Animated.View>
          <Animated.View style={rise(40)}><P style={{ fontSize: 18, maxWidth: 520 }}>Regali personalizzati, decorazioni per la casa e ricordi indimenticabili in legno e materiali naturali. Realizziamo ogni pezzo su misura per le persone che ami.</P></Animated.View>
          <Animated.View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 28 }, rise(60)]}>
            <Btn title="Scopri le Creazioni" onPress={() => ctx.current.go('creazioni')} />
            <Btn kind="outline" title="Raccontaci la tua idea" onPress={() => r.push('/su-misura')} />
          </Animated.View>
        </View>
        <Animated.View style={[{ flex: wide ? 1 : undefined, alignItems: 'center', width: '100%' }, rise(30), { transform: [{ translateY: fl.interpolate({ inputRange: [0, 1], outputRange: [0, -14] }) }] }]}>
          <View style={{ width: wide ? 510 : 300, aspectRatio: 511 / 619, borderRadius: '50%' as any, overflow: 'hidden', borderWidth: 1, borderColor: C.beige, shadowColor: '#5C4033', shadowOpacity: 0.18, shadowRadius: 30, shadowOffset: { width: 0, height: 18 } }}>
            <Image source={HERO} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
          </View>
          <View style={{ marginTop: -46, backgroundColor: C.card, borderRadius: 30, borderWidth: 1, borderColor: C.line, paddingVertical: 14, paddingHorizontal: 50 }}><Text style={{ fontFamily: F.sansS, color: C.text }}>Idee regalo personalizzate</Text></View>
        </Animated.View>
      </Wrap>

      <Anchor id="creazioni"><Wrap style={{ paddingTop: 50 }}>
        <Reveal style={{ alignItems: 'center', marginBottom: 40 }}><Label>Idee regalo</Label><H size={46} style={{ marginVertical: 12 }}>Le Nostre Creazioni</H><P>Idee personalizzate per celebrare i tuoi momenti speciali.</P></Reveal>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: g4.gap }}>{PRODUCTS.slice(0, 4).map((p, i) => <ProductCard key={p.id} p={p} i={i} width={g4.w} />)}</View>
      </Wrap></Anchor>

      <Anchor id="catalogo"><Wrap style={{ paddingTop: 90 }}>
        <Reveal style={{ alignItems: 'center', marginBottom: 30 }}><Label>Catalogo e prezzi</Label><H size={46} style={{ marginVertical: 12, textAlign: 'center' }}>Creazioni su misura, divise per tipo</H><P style={{ textAlign: 'center', maxWidth: 600 }}>Sfoglia le nostre creazioni più amate e aggiungi al carrello quelle che fanno per te. Filtra per tipo di creazione per trovare il regalo perfetto.</P></Reveal>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginBottom: 36 }}>
          {['Tutte', ...CATS].map(c => <Tap key={c} scale={1.06} onPress={() => setFilter(c)} style={{ backgroundColor: filter === c ? C.brown : 'transparent', borderWidth: 1, borderColor: filter === c ? C.brown : C.line, borderRadius: 30, paddingVertical: 10, paddingHorizontal: 18 }}><Text style={{ fontFamily: F.sansS, fontSize: 14, color: filter === c ? '#fff' : C.brown }}>{c === 'Tutte' ? 'Tutte le creazioni' : c}</Text></Tap>)}
        </View>
        {loading && <Text style={{ fontFamily: F.sans, color: C.text, textAlign: 'center' }}>Caricamento del catalogo…</Text>}
        {error && <Text style={{ fontFamily: F.sans, color: C.accent, textAlign: 'center', marginBottom: 12 }}>Catalogo non aggiornato: server non raggiungibile.</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: g5.gap }}>{list.map((p, i) => <ProductCard key={p.id + filter} p={p} i={i} width={g5.w} button />)}</View>
        <Reveal style={{ marginTop: 36, backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 24, flexDirection: 'row', gap: 12 }}>
          <Ionicons name="information-circle" size={22} color={C.accent} />
          <Text style={{ flex: 1, fontFamily: F.sans, fontSize: 14, lineHeight: 26, color: C.text }}>I prezzi mostrati sono indicativi e si riferiscono alla creazione base. Il prezzo finale dipende dalla personalizzazione, dalle dimensioni, dagli elementi incisi e dalle finiture scelte. <Text onPress={() => r.push('/su-misura')} style={{ color: C.brown, textDecorationLine: 'underline' }}>Raccontaci la tua idea</Text> e prepariamo un preventivo dedicato per te.</Text>
        </Reveal>
      </Wrap></Anchor>

      <Anchor id="valori"><Wrap style={{ paddingTop: 110 }}>
        <Reveal style={{ flexDirection: wide ? 'row' : 'column', justifyContent: 'space-between', alignItems: wide ? 'flex-end' : 'flex-start', gap: 20, marginBottom: 40 }}>
          <View style={{ flex: wide ? 1 : undefined }}><Label>I nostri valori</Label><H size={wide ? 56 : 38} style={{ marginTop: 12, lineHeight: wide ? 60 : 44 }}>Il calore del legno, la precisione del laser.</H></View>
          <View style={{ flex: wide ? 1 : undefined }}><P style={{ fontSize: 17 }}>Trasformiamo le tue idee e i tuoi ricordi più belli in oggetti unici da vivere ogni giorno, curando ogni dettaglio nel nostro laboratorio artigianale.</P></View>
        </Reveal>
        <View style={{ flexDirection: wide ? 'row' : 'column', gap: 20 }}>
          {[['01', 'Calore Artigianale', 'Scegliamo con cura legno naturale e materiali pregiati, rifinendo ogni creazione a mano per un tocco autentico.'], ['02', 'Personalizzazione Totale', 'Ogni pezzo è unico. Incidiamo nomi, date, dediche e disegni speciali per rendere il tuo regalo davvero inimitabile.'], ['03', 'Per Ogni Occasione', 'Dalla nascita di un bimbo ai matrimoni, fino alle feste di famiglia, creiamo il dettaglio perfetto per celebrare i tuoi ricordi.']].map(([n, t, d], i) => (
            <Reveal key={n} delay={i * 120} style={{ flex: wide ? 1 : undefined }}><Tap scale={1.02} style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 28, minHeight: 240 }}><Text style={{ fontFamily: F.sans, fontSize: 32, color: C.beige }}>{n}</Text><Text style={{ fontFamily: F.serif, fontSize: 24, color: C.brown, marginVertical: 14 }}>{t}</Text><P style={{ fontSize: 14, lineHeight: 28 }}>{d}</P></Tap></Reveal>
          ))}
        </View>
        <Reveal style={{ marginTop: 80, backgroundColor: C.brown, borderRadius: 50, padding: wide ? 60 : 30, flexDirection: wide ? 'row' : 'column', gap: 30 }}>
          <View style={{ flex: wide ? 1 : undefined }}><Label style={{ color: C.beige }}>Creiamo insieme</Label><H size={wide ? 48 : 34} style={{ color: '#fff', marginTop: 12, lineHeight: wide ? 50 : 40 }}>Vuoi realizzare un regalo speciale?</H></View>
          <View style={{ flex: wide ? 1.1 : undefined }}><P style={{ color: '#EBDDD0', fontSize: 17 }}>Raccontaci a chi è destinato e cosa vorresti trasmettere. Ti aiuteremo a progettare una targa, un tagliere o una decorazione che scalderà il cuore della tua famiglia.</P><Btn kind="beige" title="Richiedi la tua creazione" outer={{ alignSelf: 'flex-start', marginTop: 24 }} onPress={() => r.push('/su-misura')} /></View>
        </Reveal>
      </Wrap></Anchor>
    </Page>
  );
}
