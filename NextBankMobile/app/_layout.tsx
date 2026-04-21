import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/hooks/useAuthStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function RootLayoutNav() {
  const { isDark } = useTheme();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    // Always start fresh — force login flow every time the app opens
    logout();
  }, []);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(app)" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
