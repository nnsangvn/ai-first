import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useRootNavigation, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AuthProvider, useAuth } from '@/context/auth-context';
import { BoardProvider } from '@/context/board-context';

/* ─── Auth gate: redirect to /login when unauthenticated ────────────────── */
function AuthGate({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const segments = useSegments();
  const navigation = useRootNavigation();

  useEffect(() => {
    const isAuthGroup = segments[0] === 'login';
    if (!user && !isAuthGroup) {
      navigation?.reset({ index: 0, routes: [{ name: 'login' }] });
    } else if (user && isAuthGroup) {
      navigation?.reset({ index: 0, routes: [{ name: '/' }] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, segments]);

  if (!user) return null; // Prevent flash of protected content
  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <BoardProvider>
          <AuthGate>
            <AnimatedSplashOverlay />
            <AppTabs />
          </AuthGate>
        </BoardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
