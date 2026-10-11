import { Stack } from 'expo-router';
import { useFonts, Lora_500Medium, Lora_600SemiBold } from '@expo-google-fonts/lora';
import { Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { CatalogProvider } from '../lib/catalog';
import { CartProvider } from '../lib/cart';
import { FavProvider } from '../lib/fav';
import { AuthProvider } from '../lib/auth';
export default function Layout() {
  const [ok] = useFonts({ Lora_500Medium, Lora_600SemiBold, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold });
  if (!ok) return null;
  return <CatalogProvider><CartProvider><FavProvider><AuthProvider><Stack screenOptions={{ headerShown: false, animation: 'fade' }} /></AuthProvider></FavProvider></CartProvider></CatalogProvider>;
}
