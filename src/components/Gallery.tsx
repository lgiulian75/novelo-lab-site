import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, Pressable, Modal, Animated, PanResponder, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '../lib/theme';
import { Photo, Tap } from './ui';

function useSwipe(prev: () => void, next: () => void) {
  const cb = useRef({ prev, next }); cb.current = { prev, next };
  return useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
    onPanResponderRelease: (_, g) => { if (g.dx > 45) cb.current.prev(); else if (g.dx < -45) cb.current.next(); },
  })).current.panHandlers;
}
const Arrow = ({ d, onPress, dark }: any) => (
  <Tap onPress={onPress} scale={1.2} outer={{ position: 'absolute', top: '50%', marginTop: -22, [d]: 12 }} style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: dark ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.93)', alignItems: 'center', justifyContent: 'center' }}>
    <Ionicons name={d === 'left' ? 'chevron-back' : 'chevron-forward'} size={22} color={dark ? '#fff' : C.brown} />
  </Tap>
);
export default function Gallery({ imgs }: { imgs: any[] }) {
  const n = imgs.length; const [sel, setSel] = useState(0); const [open, setOpen] = useState(false);
  const fade = useRef(new Animated.Value(1)).current; const zoom = useRef(new Animated.Value(0.9)).current;
  const go = (i: number) => { fade.setValue(0); setSel((i + n) % n); Animated.timing(fade, { toValue: 1, duration: 420, useNativeDriver: true }).start(); };
  const prev = () => go(sel - 1), next = () => go(sel + 1); const sw = useSwipe(prev, next);
  useEffect(() => { if (open) { zoom.setValue(0.9); Animated.spring(zoom, { toValue: 1, useNativeDriver: true, bounciness: 6 }).start(); } }, [open]);
  return (
    <View>
      <View {...sw} style={{ touchAction: 'pan-y' } as any}>
        <Pressable onPress={() => setOpen(true)}>
          <Animated.View style={{ opacity: fade, borderRadius: 40, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}><Photo source={imgs[sel]} ratio={1} /></Animated.View>
        </Pressable>
        {n > 1 && <><Arrow d="left" onPress={prev} /><Arrow d="right" onPress={next} /></>}
        <View pointerEvents="none" style={{ position: 'absolute', right: 16, bottom: 16, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 16, padding: 7 }}><Ionicons name="expand" size={16} color={C.brown} /></View>
      </View>
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 14 }}>
        {imgs.map((im, i) => <Tap key={i} scale={1.05} onPress={() => go(i)} style={{ width: 84, height: 84, borderRadius: 20, overflow: 'hidden', borderWidth: 2, borderColor: i === sel ? C.brown : C.line }}><Image source={im} style={{ width: '100%', height: '100%', backgroundColor: C.bg2 }} resizeMode="contain" /></Tap>)}
      </View>
      <Text style={{ fontFamily: F.sans, fontStyle: 'italic', fontSize: 13, letterSpacing: 0.5, color: C.text, textAlign: 'center', marginTop: 18 }}>Prodotto a mano con amore da NoveloLab.</Text>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View {...sw} style={{ flex: 1, backgroundColor: 'rgba(30,20,15,0.94)', justifyContent: 'center', touchAction: 'pan-y' } as any}>
          <Pressable onPress={() => setOpen(false)} style={StyleSheet.absoluteFill} />
          <Animated.View pointerEvents="none" style={{ opacity: fade, transform: [{ scale: zoom }], height: '82%', marginHorizontal: 20 }}><Image source={imgs[sel]} style={{ width: '100%', height: '100%' }} resizeMode="contain" /></Animated.View>
          {n > 1 && <><Arrow d="left" onPress={prev} dark /><Arrow d="right" onPress={next} dark /></>}
          <Pressable onPress={() => setOpen(false)} hitSlop={10} style={{ position: 'absolute', top: 24, right: 24, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}><Ionicons name="close" size={24} color="#fff" /></Pressable>
        </View>
      </Modal>
    </View>
  );
}
