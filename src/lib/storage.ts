import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
const ls = () => (globalThis as any).localStorage;
export const storage = {
  get: async (k: string): Promise<string | null> => Platform.OS === 'web' ? (ls()?.getItem(k) ?? null) : SecureStore.getItemAsync(k),
  set: async (k: string, v: string) => { Platform.OS === 'web' ? ls()?.setItem(k, v) : await SecureStore.setItemAsync(k, v); },
  del: async (k: string) => { Platform.OS === 'web' ? ls()?.removeItem(k) : await SecureStore.deleteItemAsync(k); },
};
