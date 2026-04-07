import React from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  iconColor?: string;
}

export function EmptyState({ icon, title, message, iconColor }: EmptyStateProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;
  const color = iconColor ?? Colors.accent.DEFAULT;

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <View
        style={{
          width: 88,
          height: 88,
          borderRadius: 44,
          backgroundColor: isDark ? Colors.dark.card : Colors.light.cardAlt,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 20,
          borderWidth: 1,
          borderColor: isDark ? Colors.dark.border : Colors.light.border,
        }}
      >
        <Ionicons name={icon} size={40} color={color} />
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: '700',
          color: textColor,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: mutedColor,
          textAlign: 'center',
          lineHeight: 22,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
