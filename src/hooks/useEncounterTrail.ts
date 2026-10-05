import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export type TrailPoint = {
  id: string;
  latitude: number;
  longitude: number;
  seenAt: string;
  personId: string;
  name: string;
  role: string;
  interests: string[];
  avatarEmoji: string | null;
  avatarColor: string | null;
};

// The path of everywhere you've crossed paths with someone, oldest first,
// with who each point was with — ready for the map to draw as a line with
// tappable markers. Empty until BLE encounters exist.
export function useEncounterTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: encounters } = await supabase
        .from('encounters')
        .select('id, crossed_with_id, latitude, longitude, seen_at')
        .eq('user_id', user.id)
        .order('seen_at', { ascending: true });

      if (!encounters || encounters.length === 0) return;

      const ids = Array.from(new Set(encounters.map((e) => e.crossed_with_id)));
      const { data: profiles } = await supabase
        .from('profiles')
        .select(
          'user_id, first_name, last_name, role, interests, avatar_emoji, avatar_color'
        )
        .in('user_id', ids);

      setTrail(
        encounters.map((e) => {
          const profile = profiles?.find((p) => p.user_id === e.crossed_with_id);
          return {
            id: e.id,
            latitude: e.latitude,
            longitude: e.longitude,
            seenAt: e.seen_at,
            personId: e.crossed_with_id,
            name: profile
              ? `${profile.first_name} ${profile.last_name}`.trim()
              : 'Unknown',
            role: profile?.role ?? '',
            interests: profile?.interests ?? [],
            avatarEmoji: profile?.avatar_emoji ?? null,
            avatarColor: profile?.avatar_color ?? null,
          };
        })
      );
    })();
  }, []);

  return trail;
}
