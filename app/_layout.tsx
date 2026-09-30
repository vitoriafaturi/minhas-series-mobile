import '../global.css';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#262626' },
        headerTintColor: '#fafafa',
        contentStyle: { backgroundColor: '#262626' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Minhas Séries' }} />
      <Stack.Screen name="form" options={{ title: 'Série' }} />
      <Stack.Screen name="detalhe" options={{ title: 'Detalhe' }} />
    </Stack>
  );
}
