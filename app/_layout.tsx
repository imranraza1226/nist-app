import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeDatabase } from '../src/database/database';
import { Colors } from '../src/theme/colors';

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  useEffect(() => {
    initializeDatabase()
      .then(() => setDbReady(true))
      .catch((e) => {
        console.error('DB init error:', e);
        setError(String(e));
      });
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: Colors.dark.bg }}>
        <Text style={{ color: Colors.status.error, fontSize: 16, textAlign: 'center' }}>
          Failed to initialize database: {error}
        </Text>
      </View>
    );
  }

  if (!dbReady) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg,
        }}
      >
        <Text style={{ color: Colors.accent.DEFAULT, fontSize: 28, fontWeight: '800', letterSpacing: 1 }}>
          NIST Compass
        </Text>
        <Text style={{ color: isDark ? Colors.dark.muted : Colors.light.muted, marginTop: 8, fontSize: 14 }}>
          Loading knowledge base…
        </Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: isDark ? Colors.dark.card : Colors.primary.DEFAULT,
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 17 },
          contentStyle: {
            backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="control-detail"
          options={{
            title: 'Control Detail',
            presentation: 'card',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
