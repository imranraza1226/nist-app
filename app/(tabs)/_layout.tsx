import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/theme/colors';
import { getBookmarkCount } from '../../src/database/queries';

export default function TabLayout() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    const load = async () => {
      const count = await getBookmarkCount();
      setBookmarkCount(count);
    };
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const tabBarBg = isDark ? Colors.dark.card : '#FFFFFF';
  const tabBarBorder = isDark ? Colors.dark.border : Colors.light.border;
  const activeColor = Colors.accent.DEFAULT;
  const inactiveColor = isDark ? Colors.dark.subtle : Colors.light.subtle;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: tabBarBg,
          borderTopColor: tabBarBorder,
          borderTopWidth: 1,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginBottom: 4,
        },
        headerStyle: {
          backgroundColor: isDark ? Colors.dark.card : Colors.primary.DEFAULT,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Frameworks',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
          headerTitle: 'NIST Compass',
          headerRight: () => (
            <View style={{ marginRight: 16 }}>
              <Text style={{ color: Colors.accent.DEFAULT, fontSize: 13, fontWeight: '600' }}>
                Free Tier
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
          headerTitle: 'Search Controls',
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: 'Bookmarks',
          tabBarIcon: ({ color, size }) => (
            <View>
              <Ionicons name="bookmark-outline" size={size} color={color} />
              {bookmarkCount > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -6,
                    backgroundColor: Colors.accent.DEFAULT,
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 3,
                  }}
                >
                  <Text style={{ color: '#FFF', fontSize: 9, fontWeight: '700' }}>
                    {bookmarkCount > 99 ? '99+' : bookmarkCount}
                  </Text>
                </View>
              )}
            </View>
          ),
          headerTitle: 'My Bookmarks',
        }}
      />
    </Tabs>
  );
}
