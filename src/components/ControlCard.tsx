import React, { memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Control } from '../types';
import { Colors, getFrameworkColor, getCSFColor } from '../theme/colors';

interface ControlCardProps {
  control: Control;
  onPress: (control: Control) => void;
  onBookmark?: (control: Control) => void;
  isBookmarked?: boolean;
  showFramework?: boolean;
}

const FRAMEWORK_LABELS: Record<string, string> = {
  csf2: 'CSF 2.0',
  sp80053: 'SP 800-53',
  sp800171: 'SP 800-171',
};

export const ControlCard = memo(function ControlCard({
  control,
  onPress,
  onBookmark,
  isBookmarked = false,
  showFramework = false,
}: ControlCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;

  const frameworkColor = getFrameworkColor(control.framework);
  const functionColor =
    control.framework === 'csf2'
      ? getCSFColor(control.function_category)
      : frameworkColor;

  const preview = control.description.length > 100
    ? control.description.substring(0, 100) + '…'
    : control.description;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => onPress(control)}
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 5,
        borderWidth: 1,
        borderColor,
        borderLeftWidth: 4,
        borderLeftColor: functionColor,
        overflow: 'hidden',
      }}
    >
      <View style={{ padding: 14 }}>
        {/* Header row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          {/* Control ID badge */}
          <View
            style={{
              backgroundColor: functionColor + '22',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: functionColor + '55',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: functionColor }}>
              {control.control_id}
            </Text>
          </View>

          {showFramework && (
            <View
              style={{
                marginLeft: 8,
                backgroundColor: frameworkColor + '22',
                borderRadius: 6,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '600', color: frameworkColor }}>
                {FRAMEWORK_LABELS[control.framework]}
              </Text>
            </View>
          )}

          <View style={{ flex: 1 }} />

          {onBookmark && (
            <TouchableOpacity
              onPress={() => onBookmark(control)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={20}
                color={isBookmarked ? Colors.accent.DEFAULT : mutedColor}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: textColor,
            marginBottom: 5,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {control.title}
        </Text>

        {/* Description preview */}
        <Text style={{ fontSize: 13, color: mutedColor, lineHeight: 18 }} numberOfLines={2}>
          {preview}
        </Text>

        {/* Footer: family + function */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name="folder-outline" size={12} color={mutedColor} />
          <Text style={{ fontSize: 11, color: mutedColor, marginLeft: 4 }} numberOfLines={1}>
            {control.family}
          </Text>
          <Text style={{ fontSize: 11, color: mutedColor, marginHorizontal: 6 }}>·</Text>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: functionColor,
              marginRight: 4,
            }}
          />
          <Text style={{ fontSize: 11, color: mutedColor }}>{control.function_category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});
