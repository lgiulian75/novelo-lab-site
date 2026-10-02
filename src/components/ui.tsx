import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, Animated, Easing, Dimensions, StyleSheet, useWindowDimensions, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '../lib/theme';
import { useCart } from '../lib/cart';
import { useFav } from '../lib/fav';

type PCtx = { subs: Set<() => void>; pos: Record<string, number>; go: (id: string) => void; scrollTo: (y: number) => void };
const PC = createContext<PCtx>(null as any);
export const usePage = () => useContext(PC);
export const useWide = () => useWindowDimensions().width >= 820;
export function useGrid(max: number, gap = 20) {
  const w = useWindowDimensions().width; const inner = Math.min(w, 1180) - 48;
  const cols = w >= 1000 ? max : w >= 700 ? Math.min(max, 3) : 2;
  return { w: Math.floor((inner - (cols - 1) * gap) / cols) - 1, gap };
}
export const Wrap = ({ children, style }: any) => <View style={[{ width: '100%', maxWidth: 1180, alignSelf: 'center', paddingHorizontal: 24 }, style]}>{children}</View>;
export const Label = ({ children, style }: any) => <Text style={[{ fontFamily: F.sansS, fontSize: 12, letterSpacing: 3.5, color: C.accent, textTransform: 'uppercase' }, style]}>{children}</Text>;
export const H = ({ children, size = 44, style }: any) => <Text style={[{ fontFamily: F.serif, fontSize: size, lineHeight: size * 1.12, color: C.brown }, style]}>{children}</Text>;
export const P = ({ children, style }: any) => <Text style={[{ fontFamily: F.sans, fontSize: 16, lineHeight: 28, color: C.text }, style]}>{children}</Text>;

export const Photo = ({ source, ratio = 1, style }: any) => <View style={[{ width: '100%', aspectRatio: ratio, overflow: 'hidden', backgroundColor: C.bg2 }, style]}><Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="contain" /></View>;
export function FavBtn({ id, style, size = 20 }: any) {
  const { has, toggle } = useFav(); const on = has(id); const s = useRef(new Animated.Value(1)).current;
  const press = () => { toggle(id); Animated.sequence([Animated.timing(s, { toValue: 1.4, duration: 120, useNativeDriver: true }), Animated.spring(s, { toValue: 1, useNativeDriver: true })]).start(); };
  return <Pressable onPress={press} hitSlop={8} style={[{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.93)', alignItems: 'center', justifyContent: 'center' }, style]}><Animated.View style={{ transform: [{ scale: s }] }}><Ionicons name={on ? 'heart' : 'heart-outline'} size={size} color={on ? '#D4546A' : C.brown} /></Animated.View></Pressable>;
}
export function Tap({ onPress, style, outer, children, scale = 1.04 }: any) {
  const s = useRef(new Animated.Value(1)).current;
  const to = (v: number) => Animated.spring(s, { toValue: v, useNativeDriver: true, speed: 28, bounciness: 7 }).start();
  return (
    <Pressable onPress={onPress} onHoverIn={() => to(scale)} onHoverOut={() => to(1)} onPressIn={() => to(0.96)} onPressOut={() => to(1)} style={outer}>
      <Animated.View style={[style, { transform: [{ scale: s }] }]}>{children}</Animated.View>
    </Pressable>
  );
}
export function Btn({ title, onPress, kind = 'solid', outer, disabled }: any) {
  const bg = kind === 'solid' ? C.brown : kind === 'beige' ? C.beige : 'transparent';
  return (
    <Tap onPress={disabled ? undefined : onPress} outer={outer} style={{ backgroundColor: bg, borderWidth: kind === 'outline' ? 1 : 0, borderColor: C.line, borderRadius: 30, paddingVertical: 15, paddingHorizontal: 26, alignItems: 'center', opacity: disabled ? 0.6 : 1 }}>
      <Text style={{ fontFamily: F.sansB, fontSize: 14, color: kind === 'solid' ? '#fff' : C.brown }}>{title}</Text>
    </Tap>
  );
}
export function Reveal({ children, delay = 0, style }: any) {
  const { subs } = usePage(); const v = useRef(new Animated.Value(0)).current; const ref = useRef<any>(null); const done = useRef(false);
  const check = () => { if (done.current) return; ref.current?.measureInWindow((_x: number, y: number) => {
    if (!done.current && y < Dimensions.get('window').height - 30) { done.current = true; subs.delete(check); Animated.timing(v, { toValue: 1, duration: 750, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start(); } }); };
  useEffect(() => { subs.add(check); const t = setTimeout(check, 250); return () => { subs.delete(check); clearTimeout(t); }; }, []);
  return <Animated.View ref={ref} style={[style, { opacity: v, transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [32, 0] }) }] }]}>{children}</Animated.View>;
}
export const Anchor = ({ id, children, style }: any) => { const { pos } = usePage(); return <View onLayout={e => { pos[id] = e.nativeEvent.layout.y; }} style={style}>{children}</View>; };

const NAV: [string, string][] = [['Home', 'top'], ['Creazioni', 'creazioni'], ['Catalogo', 'catalogo'], ['Valori', 'valori'], ['Su misura', '/su-misura']];
function Header({ shadow }: { shadow: boolean }) {
  const r = useRouter(); const { go } = usePage(); const { count } = useCart(); const fav = useFav().ids.length; const wide = useWide(); const [open, setOpen] = useState(false);
  const b = useRef(new Animated.Value(1)).current;
  useEffect(() => { if (count) Animated.sequence([Animated.timing(b, { toValue: 1.5, duration: 140, useNativeDriver: true }), Animated.spring(b, { toValue: 1, useNativeDriver: true })]).start(); }, [count]);
  const nav = (t: string) => { setOpen(false); t.startsWith('/') ? r.push(t as any) : go(t); };
  return (
    <View style={[{ backgroundColor: 'rgba(250,246,240,0.97)', borderBottomWidth: 1, borderColor: C.line, zIndex: 10 }, shadow && { shadowColor: '#5C4033', shadowOpacity: 0.12, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 6 }]}>
      <Wrap style={{ height: 80, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={() => nav('top')}><Text style={{ fontFamily: F.serif, fontSize: 26, color: C.brown }}>NoveloLab</Text></Pressable>
        {wide && <View style={{ flexDirection: 'row', gap: 26 }}>{NAV.map(([n, t]) => <Pressable key={n} onPress={() => nav(t)}><Text style={{ fontFamily: F.sansS, fontSize: 13, letterSpacing: 3, color: C.text, textTransform: 'uppercase' }}>{n}</Text></Pressable>)}</View>}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Tap onPress={() => r.push('/preferiti')} style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="heart" size={18} color={C.brown} />
            {fav > 0 && <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: C.accent, minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: '#fff', fontSize: 11, fontFamily: F.sansB }}>{fav}</Text></View>}
          </Tap>
          <Tap onPress={() => r.push('/cart')} style={{ width: 46, height: 46, borderRadius: 23, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="bag" size={18} color={C.brown} />
            {count > 0 && <Animated.View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: C.accent, minWidth: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', transform: [{ scale: b }] }}><Text style={{ color: '#fff', fontSize: 11, fontFamily: F.sansB }}>{count}</Text></Animated.View>}
          </Tap>
          {!wide && <Pressable onPress={() => setOpen(!open)}><Ionicons name={open ? 'close' : 'menu'} size={28} color={C.brown} /></Pressable>}
        </View>
      </Wrap>
      {!wide && open && <Wrap style={{ paddingBottom: 14 }}>{NAV.map(([n, t]) => <Pressable key={n} onPress={() => nav(t)} style={{ paddingVertical: 10 }}><Text style={{ fontFamily: F.sansS, letterSpacing: 3, color: C.text, textTransform: 'uppercase' }}>{n}</Text></Pressable>)}</Wrap>}
    </View>
  );
}
function Footer() {
  const r = useRouter(); const wide = useWide();
  const to = (cat: string) => r.push({ pathname: '/', params: { s: 'catalogo', cat, t: String(Date.now()) } });
  const L = ({ t, f }: any) => <Pressable onPress={f}><Text style={{ fontFamily: F.sans, color: C.text, fontSize: 14, marginBottom: 12 }}>{t}</Text></Pressable>;
  const Hd = ({ t }: any) => <Text style={{ fontFamily: F.serif, fontSize: 14, color: C.brown, textTransform: 'uppercase', marginBottom: 16 }}>{t}</Text>;
  return (
    <View style={{ backgroundColor: '#FAF6EF', borderTopWidth: 1, borderColor: C.line, marginTop: 70 }}>
      <Wrap style={{ paddingVertical: 50, flexDirection: wide ? 'row' : 'column', gap: 32 }}>
        <View style={{ flex: wide ? 1.2 : undefined }}><Text style={{ fontFamily: F.sans, fontSize: 28, color: C.brown, marginBottom: 14 }}>NoveloLab</Text><P style={{ fontSize: 14, lineHeight: 28 }}>Creazioni in legno e materiali naturali personalizzate per la tua famiglia. Trasformiamo le tue emozioni in ricordi da toccare con mano.</P></View>
        <View style={{ flex: wide ? 1 : undefined }}><Hd t="Le creazioni" /><L t="Decorazioni Casa" f={() => to('Decorazioni Casa')} /><L t="Articoli Camerette" f={() => to('Bambini')} /><L t="Regali Personalizzati" f={() => to('Cucina e Regali')} /><L t="Eventi e Bomboniere" f={() => to('Eventi')} /></View>
        <View style={{ flex: wide ? 1 : undefined }}><Hd t="Il laboratorio" /><L t="I Nostri Valori" f={() => r.push({ pathname: '/', params: { s: 'valori', t: String(Date.now()) } })} /><L t="Richiedi un'Idea" f={() => r.push('/su-misura')} /><L t="Condizioni" f={() => r.push('/condizioni')} /></View>
        <View style={{ flex: wide ? 1 : undefined }}><Hd t="Contatti" /><P style={{ fontSize: 14, lineHeight: 28, marginBottom: 14 }}>Siamo a disposizione per aiutarti a progettare il tuo regalo speciale.</P><Btn kind="outline" title="Scrivici un'email" outer={{ alignSelf: 'flex-start' }} onPress={() => Linking.openURL('mailto:info@novelolab.it')} /></View>
      </Wrap>
      <View style={{ borderTopWidth: 1, borderColor: C.line, paddingVertical: 22 }}><Text style={{ textAlign: 'center', fontFamily: F.sansS, fontSize: 12, letterSpacing: 3, color: C.text }}>© 2026 NOVELOLAB</Text></View>
    </View>
  );
}
export function Page({ children, onReady }: { children: React.ReactNode; onReady?: (c: PCtx) => void }) {
  const r = useRouter(); const sv = useRef<ScrollView>(null); const [shadow, setShadow] = useState(false);
  const ctx = useRef<PCtx>({ subs: new Set(), pos: {}, scrollTo: y => sv.current?.scrollTo({ y, animated: true }), go: id => { const c = ctx; if (id === 'top') return c.pos.__home !== undefined ? c.scrollTo(0) : r.push('/'); c.pos[id] !== undefined ? c.scrollTo(c.pos[id] - 70) : r.push({ pathname: '/', params: { s: id, t: String(Date.now()) } }); } }).current;
  useEffect(() => { onReady?.(ctx); }, []);
  return (
    <PC.Provider value={ctx}>
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <Header shadow={shadow} />
        <ScrollView ref={sv} scrollEventThrottle={50} onScroll={e => { const y = e.nativeEvent.contentOffset.y; setShadow(y > 8); ctx.subs.forEach(f => f()); }} contentContainerStyle={{ flexGrow: 1 }}>
          {children}
          <Footer />
        </ScrollView>
      </View>
    </PC.Provider>
  );
}
