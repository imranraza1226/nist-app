import React from 'react';
import { ScrollView, TouchableOpacity, Text, View, useColorScheme } from 'react-native';
import { Colors } from '../theme/colors';

interface ChipProps {
  label: string;
  active?: boolean;
  onPress: () => void;
  color?: string;
}

export function FilterChip({ label, active = false, onPress, color }: ChipProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const activeColor = color ?? Colors.accent.DEFAULT;
  const inactiveBg = isDark ? Colors.dark.card : Colors.light.card;
  const inactiveBorder = isDark ? Colors.dark.border : Colors.light.border;
  const inactiveText = isDark ? Colors.dark.muted : Colors.light.muted;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 20,
        backgroundColor: active ? activeColor : inactiveBg,
        borderWidth: 1,
        borderColor: active ? activeColor : inactiveBorder,
        marginRight: 8,
      }}
    >
      <Text
        style={{
          fontSize: 13,
          fontWeight: active ? '600' : '400',
          color: active ? '#FFFFFF' : inactiveText,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface FilterRowProps {
  options: { label: string; value: string | undefined; color?: string }[];
  selected: string | undefined;
  onSelect: (value: string | undefined) => void;
}

export function FilterRow({ options, selected, onSelect }: FilterRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
    >
      {options.map((opt) => (
        <FilterChip
          key={opt.value ?? 'all'}
          label={opt.label}
          active={selected === opt.value}
          onPress={() => onSelect(selected === opt.value ? undefined : opt.value)}
          color={opt.color}
        />
      ))}
    </ScrollView>
  );
}
