import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ REEMPLAZA CON TUS CREDENCIALES DE SUPABASE:
// 1. Ve a https://supabase.com y crea tu proyecto gratuito
// 2. En Settings -> API copia el URL y el Anon Public Key
const SUPABASE_URL = 'https://wvswcnwofyvrfaaqpiaf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LGzjT5oFksrPp6r_beOu-Q_6V1-PckN';

// Cliente de Supabase con sesión persistente en AsyncStorage para React Native / Expo
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Comprueba si el usuario ya configuró sus credenciales reales
export const isSupabaseConfigured = () => {
  return (
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    !SUPABASE_URL.includes('TU-PROYECTO') &&
    !SUPABASE_ANON_KEY.includes('TU-ANON-KEY')
  );
};
