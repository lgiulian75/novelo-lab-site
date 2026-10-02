import { Stack } from 'expo-router';
import { useFonts, Lora_500Medium, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { CartProvider } from '../lib/cart';
import { FavProvider } from '../lib/fav';
export default function Layout() {
  const [ok] = useFonts({ Lora_500Medium, Lora_600SemiBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });
  if (!ok) return null;
  return <CartProvider><FavProvider><Stack screenOptions={{ headerShown: false, animation: 'fade' }} /></FavProvider></CartProvider>;
}
