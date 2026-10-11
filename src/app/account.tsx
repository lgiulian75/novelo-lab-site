import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Page, Wrap, Label, H, P, Btn, Reveal } from '../components/ui';
import { C, F } from '../lib/theme';
import { useAuth } from '../lib/auth';
export default function Account() {
  const r = useRouter(); const { user, loading, logout } = useAuth();
  useEffect(() => { if (!loading && !user) r.replace('/accedi'); }, [user, loading]);
  if (!user) return <Page><View /></Page>;
  return (
    <Page>
      <Wrap style={{ paddingTop: 70, maxWidth: 700 }}>
        <Reveal>
          <Label>Il tuo account</Label><H size={48} style={{ marginVertical: 14 }}>Ciao, {user.name}</H>
          <View style={{ backgroundColor: C.card, borderWidth: 1, borderColor: C.line, borderRadius: 40, padding: 28, gap: 6 }}>
            <Text style={{ fontFamily: F.sansS, fontSize: 12, letterSpacing: 3, color: C.accent, textTransform: 'uppercase' }}>Email</Text>
            <P>{user.email}</P>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 20 }}>
              <Btn kind="outline" title="I miei preferiti" onPress={() => r.push('/preferiti')} />
              <Btn kind="outline" title="Il mio carrello" onPress={() => r.push('/cart')} />
              <Btn title="Esci" onPress={async () => { await logout(); r.replace('/'); }} />
            </View>
          </View>
        </Reveal>
      </Wrap>
    </Page>
  );
}
