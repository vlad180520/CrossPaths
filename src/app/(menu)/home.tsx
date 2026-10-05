import AvatarPicker from "@/components/home/AvatarPicker";
import LocateButton from "@/components/home/LocateButton";
import PersonPopup, { type Person } from "@/components/home/PersonPopup";
import ProfileButton from "@/components/home/ProfileButton";
import ProfileMenu from "@/components/home/ProfileMenu";
import WelcomePopup from "@/components/onboarding/WelcomePopup";
import { useDeviceLocation } from "@/hooks/useDeviceLocation";
import { useEncounterTrail } from "@/hooks/useEncounterTrail";
import { useProfileDraft } from "@/state/profile";
import { colors } from "@/theme";
import { AppleMaps } from "expo-maps";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Live map + your own location. Nearby CrossPaths users aren't plotted yet —
// that needs the BLE + location-exchange feature to be built first.
const PROFILE_BUTTON_SIZE = 44;
const PROFILE_BUTTON_GAP = 12;

export default function Home() {
  const insets = useSafeAreaInsets();
  const { justOnboarded } = useLocalSearchParams<{ justOnboarded?: string }>();
  const { firstName, lastName, role, interests, avatarEmoji, avatarColor, setAvatar } =
    useProfileDraft();
  const { coordinates, mapRef, recenter } = useDeviceLocation();
  const trail = useEncounterTrail();
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [profileMenuVisible, setProfileMenuVisible] = useState(false);
  const [showWelcome, setShowWelcome] = useState(justOnboarded === "1");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  return (
    <View style={styles.root}>
      <AppleMaps.View
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        cameraPosition={{ coordinates, zoom: 12.5 }}
        // The native blue dot always reflects the real device GPS position —
        // there's no way to make it appear elsewhere. Disabled here in favor
        // of our own "me" marker below, which we can place anywhere.
        properties={{ isMyLocationEnabled: false }}
        uiSettings={{
          myLocationButtonEnabled: false,
          togglePitchEnabled: false,
        }}
        // Trail of everywhere you've crossed paths with someone. Empty
        // until BLE encounters exist — a single point can't draw a line.
        polylines={
          trail.length > 0
            ? [
                {
                  id: "trail",
                  // Ends at your current location, so the line reads as
                  // "everyone you met today, leading up to where you are now."
                  coordinates: [
                    ...trail.map((point) => ({
                      latitude: point.latitude,
                      longitude: point.longitude,
                    })),
                    coordinates,
                  ],
                  color: colors.primary,
                  width: 3,
                },
              ]
            : []
        }
        // TODO: replace with real nearby users once the BLE + location-exchange
        // feature exists.
        // Using `markers` instead of `annotations` here — the custom badge
        // (annotations) was hitting a known iOS 26 SwiftUI Map tap-reliability
        // bug; native markers use MapKit's own selection handling instead.
        markers={[
          // Our own "you are here" marker, since the native blue dot can't
          // be placed anywhere but the real GPS position.
          {
            id: "me",
            coordinates,
            systemImage: "location.fill",
            tintColor: "#007AFF",
          },
          // One marker per trail point, so you can tap to see who each
          // encounter was with, not just a bare line.
          ...trail.map((point) => ({
            id: point.id,
            coordinates: {
              latitude: point.latitude,
              longitude: point.longitude,
            },
            monogram: point.name.slice(0, 2).toUpperCase(),
            tintColor: point.avatarColor || colors.primary,
          })),
        ]}
        onMarkerClick={(marker) => {
          if (!marker.id) return;

          const point = trail.find((p) => p.id === marker.id);
          if (point) {
            setSelectedPerson({
              id: point.personId,
              name: point.name,
              role: point.role,
              interests: point.interests,
              avatarEmoji: point.avatarEmoji,
              avatarColor: point.avatarColor,
            });
          }
        }}
      />

      <ProfileButton
        top={insets.top + 12}
        onPress={() => setProfileMenuVisible(true)}
        emoji={avatarEmoji}
        color={avatarColor}
      />

      <LocateButton bottom={insets.bottom + 24} onPress={recenter} />

      <PersonPopup
        person={selectedPerson}
        onClose={() => setSelectedPerson(null)}
        myInterests={interests}
      />

      <ProfileMenu
        visible={profileMenuVisible}
        onClose={() => setProfileMenuVisible(false)}
        firstName={firstName}
        lastName={lastName}
        role={role}
        interests={interests}
        avatarEmoji={avatarEmoji}
        avatarColor={avatarColor}
        onEditAvatar={() => {
          setProfileMenuVisible(false);
          setShowAvatarPicker(true);
        }}
      />

      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        initials={`${firstName.slice(0, 1)}${lastName.slice(0, 1)}` || "?"}
        currentEmoji={avatarEmoji}
        currentColor={avatarColor}
        onSaved={setAvatar}
      />

      <WelcomePopup
        visible={showWelcome}
        onClose={() => setShowWelcome(false)}
        firstName={firstName}
        role={role}
        interestsCount={interests.length}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
