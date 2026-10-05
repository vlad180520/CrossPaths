import { ensureAnonymousSession, supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

// "Onboarded" isn't a separate flag we store anywhere — it's derived from
// whether a `profiles` row exists for this device's identity. That way reset
// (which deletes the row) and onboarding completion (which inserts it) can't
// drift out of sync with a boolean living somewhere else.
export function useOnboardingStatus() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await ensureAnonymousSession();
      } catch {
        // No session — treat as not onboarded rather than hanging forever.
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Failed to check onboarding status:', error.message);
      }

      setOnboarded(!!data);
      setLoading(false);
    })();
  }, []);

  return { loading, onboarded };
}
