import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_KEY. Add them to .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    // There's no login screen — every device gets a silent anonymous
    // identity instead (see ensureAnonymousSession below).
    detectSessionInUrl: false,
  },
});

// Every device needs a stable identity so `profiles`/`encounters` rows can be
// scoped with Row Level Security, without requiring an actual login screen.
// Call this once, as early as possible (see src/app/_layout.tsx).
export async function ensureAnonymousSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session) return;

  const { error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.error('Failed to start an anonymous session:', error.message);
    throw error;
  }
}
