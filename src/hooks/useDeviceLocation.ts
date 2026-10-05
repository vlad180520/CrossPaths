import * as Location from 'expo-location';
import { useRef, useState } from 'react';
import type { AppleMaps } from 'expo-maps';

// Parcul Tineretului, Bucharest — used as the default "you are here" spot
// instead of the real device location. Real location is only fetched when
// `recenter()` is called explicitly (the 📍 button), not automatically on
// mount.
const FALLBACK_COORDINATES = { latitude: 44.4172, longitude: 26.1187 };

export function useDeviceLocation() {
  const [coordinates, setCoordinates] = useState(FALLBACK_COORDINATES);
  const mapRef = useRef<AppleMaps.MapView>(null);

  const recenter = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const position = await Location.getCurrentPositionAsync({});
    const next = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
    setCoordinates(next);
    // cameraPosition only sets the map's initial view, so move it explicitly
    // once we know where you actually are.
    mapRef.current?.setCameraPosition({ coordinates: next, zoom: 14 });
  };

  return { coordinates, mapRef, recenter };
}
