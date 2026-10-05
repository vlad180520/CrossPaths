// CrossPaths design tokens — lifted from the HTML prototype.
export const colors = {
  bg: '#f3ede1',
  ink: '#1c2b3a',
  primary: '#c98a3c',
  primarySoft: '#ecdcc0',
  muted: '#7c7262',
  muted2: '#5c5346',
  faint: '#a89b85',
  placeholder: '#cabe9f',
  chip: '#ece0cd',
  border: '#e6dac2',
  dot: '#e8dcc4',
  green: '#2fa98b',
  greenSoft: '#eef3ef',
  white: '#ffffff',
} as const;

export const radius = { md: 14, lg: 16, xl: 22, pill: 100 } as const;

// The prototype uses Space Grotesk (headings) + DM Sans (body).
// To match exactly: `npx expo install @expo-google-fonts/space-grotesk @expo-google-fonts/dm-sans`,
// load them with useFonts in the root layout, then set these to the loaded family names.
// Until then these fall back to the platform system font (undefined = system).
export const fonts = {
  heading: undefined as string | undefined, // e.g. 'SpaceGrotesk_600SemiBold'
  body: undefined as string | undefined,     // e.g. 'DMSans_400Regular'
} as const;

export const INTEREST_POOL = [
  'Design systems', 'LLMs', 'Rust', 'Swift', 'Coffee', 'Bouldering',
  'Edge compute', 'Postgres', 'Typography', 'Cycling', 'Piano', 'F1',
  'Sensors', 'Ceramics', 'Jazz', 'Trail running', 'Prototyping', 'Robotics',
];
