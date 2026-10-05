import { useOnboardingStatus } from '@/hooks/useOnboardingStatus';
import { colors } from '@/theme';
import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { loading, onboarded } = useOnboardingStatus();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={colors.ink} />
      </View>
    );
  }

  return <Redirect href={onboarded ? '/home' : '/onboarding/welcome'} />;
}
