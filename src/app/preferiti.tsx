import React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Wrap, Label, H, P, Btn, Reveal, useGrid } from '../components/ui';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../lib/data';
import { useFav } from '../lib/fav';
export default function Preferiti() {
  const r = useRouter(); const { ids } = useFav(); const g = useGrid(4);
  const list = PRODUCTS.filter(p => ids.includes(p.id));
  return (
    <Page>
      <Wrap style={{ paddingTop: 70 }}>
        <Label>I tuoi preferiti</Label><H size={52} style={{ marginVertical: 14 }}>Preferiti</H>
        {!list.length ? <Reveal><P>Non hai ancora salvato nessuna creazione. Tocca il cuore su un prodotto per aggiungerlo qui.</P><Btn title="Scopri le creazioni" outer={{ alignSelf: 'flex-start', marginTop: 18 }} onPress={() => r.push({ pathname: '/', params: { s: 'catalogo', t: String(Date.now()) } })} /></Reveal>
          : <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: g.gap, marginTop: 20 }}>{list.map((p, i) => <ProductCard key={p.id} p={p} i={i} width={g.w} button />)}</View>}
      </Wrap>
    </Page>
  );
}
