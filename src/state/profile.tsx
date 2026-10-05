import { ensureAnonymousSession, supabase } from "@/lib/supabase";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ProfileDraft = {
  firstName: string;
  lastName: string;
  role: string;
  interests: string[];
  avatarEmoji: string | null;
  avatarColor: string | null;
};

type ProfileContextValue = ProfileDraft & {
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  setRole: (v: string) => void;
  toggleInterest: (v: string) => void;
  setAvatar: (emoji: string | null, color: string | null) => void;
  reset: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

/**
 * Holds the profile being built during onboarding — and, for a returning
 * user who skips onboarding, hydrated from their saved Supabase row on
 * launch (see the effect below), since nothing else keeps this in sync
 * across app restarts.
 */
export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [avatarEmoji, setAvatarEmoji] = useState<string | null>(null);
  const [avatarColor, setAvatarColor] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await ensureAnonymousSession();
      } catch {
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, role, interests, avatar_emoji, avatar_color")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) return;

      setFirstName(data.first_name ?? "");
      setLastName(data.last_name ?? "");
      setRole(data.role ?? "");
      setInterests(data.interests ?? []);
      setAvatarEmoji(data.avatar_emoji);
      setAvatarColor(data.avatar_color);
    })();
  }, []);

  const value = useMemo<ProfileContextValue>(
    () => ({
      firstName,
      lastName,
      role,
      interests,
      avatarEmoji,
      avatarColor,
      setFirstName,
      setLastName,
      setRole,
      toggleInterest: (v) =>
        setInterests((prev) =>
          prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v],
        ),
      setAvatar: (emoji, color) => {
        setAvatarEmoji(emoji);
        setAvatarColor(color);
      },
      reset: () => {
        setFirstName("");
        setLastName("");
        setRole("");
        setInterests([]);
        setAvatarEmoji(null);
        setAvatarColor(null);
      },
    }),
    [firstName, lastName, role, interests, avatarEmoji, avatarColor],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileDraft() {
  const ctx = useContext(ProfileContext);
  if (!ctx)
    throw new Error("useProfileDraft must be used within a ProfileProvider");
  return ctx;
}
