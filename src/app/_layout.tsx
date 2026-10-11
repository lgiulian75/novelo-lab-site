import { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { useFonts, Lora_500Medium, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { CatalogProvider } from '../lib/catalog';
import { CartProvider } from '../lib/cart';
import { FavProvider } from '../lib/fav';
import { AuthProvider } from '../lib/auth';
const TITLES: Record<string, string> = { '/': 'Home', '/cart': 'Carrello', '/su-misura': 'Su misura', '/preferiti': 'Preferiti', '/accedi': 'Accedi', '/registrati': 'Registrati', '/account': 'Account', '/condizioni': 'Condizioni', '/contatti': 'Contatti' };
// Imposta il titolo della scheda del browser in base alla pagina (le pagine prodotto lo impostano da sole)
function TitleSetter() {
  const path = usePathname();
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined' || path.startsWith('/prodotto/')) return;
    const t = TITLES[path]; if (!t) return;
    const id = setTimeout(() => { document.title = 'NoveloLab | ' + t; }, 60);
    return () => clearTimeout(id);
  }, [path]);
  return null;
}
export default function Layout() {
  const [ok] = useFonts({ Lora_500Medium, Lora_600SemiBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });
  if (!ok) return null;
  return <CatalogProvider><CartProvider><FavProvider><AuthProvider><Stack screenOptions={{ headerShown: false, animation: 'fade' }}><Stack.Screen name="index" options={{ title: 'NoveloLab | Home' }} /><Stack.Screen name="cart" options={{ title: 'NoveloLab | Carrello' }} /><Stack.Screen name="su-misura" options={{ title: 'NoveloLab | Su misura' }} /><Stack.Screen name="preferiti" options={{ title: 'NoveloLab | Preferiti' }} /><Stack.Screen name="accedi" options={{ title: 'NoveloLab | Accedi' }} /><Stack.Screen name="registrati" options={{ title: 'NoveloLab | Registrati' }} /><Stack.Screen name="account" options={{ title: 'NoveloLab | Account' }} /><Stack.Screen name="condizioni" options={{ title: 'NoveloLab | Condizioni' }} /><Stack.Screen name="contatti" options={{ title: 'NoveloLab | Contatti' }} /></Stack><TitleSetter /></AuthProvider></FavProvider></CartProvider></CatalogProvider>;
}
