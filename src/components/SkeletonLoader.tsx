import React, { useEffect, useRef } from 'react';
import { View, Animated, useColorScheme } from 'react-native';
import { Colors } from '../theme/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export function SkeletonBox({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.4)).current;
  const scheme = useColorScheme();

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const bgColor = scheme === 'dark' ? Colors.dark.border : Colors.light.border;

  return (
    <Animated.View
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: bgColor,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function ControlCardSkeleton() {
  return (
    <View style={{ marginHorizontal: 16, marginVertical: 6, padding: 16, borderRadius: 12, backgroundColor: 'transparent' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <SkeletonBox width={60} height={24} borderRadius={6} />
        <View style={{ flex: 1 }} />
        <SkeletonBox width={80} height={20} borderRadius={10} />
      </View>
      <SkeletonBox height={18} borderRadius={6} style={{ marginBottom: 8 }} />
      <SkeletonBox width="80%" height={14} borderRadius={6} />
    </View>
  );
}

export function FrameworkCardSkeleton() {
  return (
    <View style={{ margin: 16, padding: 20, borderRadius: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <SkeletonBox width={48} height={48} borderRadius={12} />
        <View style={{ marginLeft: 16, flex: 1 }}>
          <SkeletonBox height={20} borderRadius={6} style={{ marginBottom: 8 }} />
          <SkeletonBox width="60%" height={14} borderRadius={6} />
        </View>
      </View>
      <SkeletonBox height={14} borderRadius={6} style={{ marginBottom: 6 }} />
      <SkeletonBox width="70%" height={14} borderRadius={6} />
    </View>
  );
}
