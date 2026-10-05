# CrossPaths

A cross-platform (iOS / Android) mobile app for discovering the people you cross paths with during the day and connecting over shared interests.

Built solo during the 3DUPB Summer School at POLITEHNICA Bucharest (June - September 2026).

## Features

- **Onboarding** - name, role and interests, kept across screens with React context.
- **Live map** - current location with permission handling and a recenter button (`expo-maps`, `expo-location`).
- **Encounter trail** - every encounter is saved with its coordinates, and the day's path is drawn on the map from the first person met to your current location. Tapping a marker opens that person's profile with shared interests highlighted.
- **History** - everyone you have met, with shared interests and the number of encounters per person.
- **Saved people** - keep the profiles you want to follow up with.
- **Statistics** - people met, longest streak of consecutive days, most common shared interest.
- **Profile** - edit your details, choose an avatar (emoji and color), or reset your profile.

## Tech stack

| Layer | Technology |
|---|---|
| App | React Native, Expo (SDK 57), Expo Router, TypeScript |
| Backend | Supabase (PostgreSQL, Auth) |
| Maps & location | expo-maps, expo-location |

## Data model

- `profiles` - one row per user: name, role, interests, avatar emoji and color.
- `encounters` - one row per encounter: who you met (`crossed_with_id`), where (`latitude`, `longitude`) and when (`seen_at`). The daily trail and the history are rebuilt from this table.

## Roadmap

- Bluetooth Low Energy proximity detection (`react-native-ble-plx`): devices exchange anonymous rotating IDs, and the server resolves them to profiles only on request.
- Distance estimation from received signal strength (RSSI).

## Running locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` with your Supabase project:

   ```bash
   EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=<your-anon-key>
   ```

3. Build and run on a device or simulator (a development build is required for native modules):

   ```bash
   npx expo run:ios
   # or
   npx expo run:android
   ```
