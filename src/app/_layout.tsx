import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { UserProvider } from '@/hooks/useUser';
import { initDb } from '@/lib/db';
import { NavBar } from '@/components/NavBar';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const setup = async () => {
      try {
        await initDb();
      } catch (e: any) {
        console.error("Database initialization failed", e);
      } finally {
        setDbInitialized(true);
      }
    };
    setup();
  }, []);

  if (!dbInitialized) {
    return null; 
  }

  return (
    <UserProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <Slot />
        <NavBar />
      </ThemeProvider>
    </UserProvider>
  );
}
