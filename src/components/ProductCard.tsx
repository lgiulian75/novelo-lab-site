import React, { useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { C, F } from '../lib/theme';
import { Product, eur } from '../lib/data';
import { Reveal, Tap, Btn, Label, Photo, FavBtn } from './ui';
import { useCart } from '../lib/cart';
export default function ProductCard({ p, width, i = 0, button }: { p: Product; width: number; i?: number; button?: boolean }) {
  const { add } = useCart(); const r = useRouter(); const [ok, setOk] = useState(false); const sm = useWindowDimensions().width < 700;
  const buy = () => { add(p.id); setOk(true); setTimeout(() => setOk(false), 1300); };
  return (
    <Reveal delay={(i % 5) * 90} style={{ width }}>
      <Tap outer={{ flex: 1 }} scale={1.025} onPress={() => r.push(`/prodotto/${p.id}` as any)} style={{ flex: 1, backgroundColor: C.card, borderRadius: sm ? 24 : 30, borderWidth: 1, borderColor: C.line, overflow: 'hidden', shadowColor: '#5C4033', shadowOpacity: 0.08, shadowRadius: 20, shadowOffset: { width: 0, height: 10 } }}>
        <View><Photo source={p.img} ratio={1} /><FavBtn id={p.id} style={{ position: 'absolute', top: 10, right: 10 }} /></View>
        <View style={{ padding: sm ? 14 : 20, flex: 1 }}>
          <Label style={{ fontSize: sm ? 10 : 11, letterSpacing: sm ? 1.5 : 2.5, marginBottom: 8 }}>{p.cat}</Label>
          <Text style={{ fontFamily: F.serif, fontSize: sm ? 16 : 22, lineHeight: sm ? 22 : 32, color: C.brown, minHeight: sm ? 66 : 64 }}>{p.name}</Text>
          <Text style={{ fontFamily: F.sans, color: C.text, marginVertical: 8 }}>{eur(p.price)}</Text>
          {button && <View style={{ marginTop: 'auto' }}><Btn title={ok ? 'Aggiunto ✓' : sm ? 'Aggiungi' : 'Aggiungi al carrello'} onPress={buy} /></View>}
        </View>
      </Tap>
    </Reveal>
  );
}
