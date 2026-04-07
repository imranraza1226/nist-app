import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  Animated,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Control, Framework } from '../../src/types';
import { Colors, getCSFColor, getFrameworkColor } from '../../src/theme/colors';
import { ControlCard } from '../../src/components/ControlCard';
import { FrameworkCardSkeleton, ControlCardSkeleton } from '../../src/components/SkeletonLoader';
import { EmptyState } from '../../src/components/EmptyState';
import {
  getControlsByFramework,
  getFunctionsByFramework,
  isBookmarked,
  addBookmark,
  removeBookmark,
} from '../../src/database/queries';

// ── Framework config ──────────────────────────────────────────

const FRAMEWORKS: {
  id: Framework;
  name: string;
  shortName: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  description: string;
}[] = [
  {
    id: 'csf2',
    name: 'NIST Cybersecurity Framework 2.0',
    shortName: 'CSF 2.0',
    subtitle: '6 Functions · 22 Categories',
    icon: 'shield-checkmark-outline',
    color: Colors.frameworks.csf2,
    description:
      'The gold standard for cybersecurity risk management with 6 core functions: Govern, Identify, Protect, Detect, Respond, and Recover.',
  },
  {
    id: 'sp80053',
    name: 'NIST SP 800-53 Rev 5',
    shortName: 'SP 800-53',
    subtitle: '20 Control Families · 1000+ Controls',
    icon: 'server-outline',
    color: Colors.frameworks.sp80053,
    description:
      'Comprehensive security and privacy controls for federal information systems and organizations. The definitive FISMA compliance guide.',
  },
  {
    id: 'sp800171',
    name: 'NIST SP 800-171',
    shortName: 'SP 800-171',
    subtitle: '14 Requirement Families · 110 Controls',
    icon: 'lock-closed-outline',
    color: Colors.frameworks.sp800171,
    description:
      'Protecting Controlled Unclassified Information (CUI) in non-federal systems. Required for DFARS compliance and CMMC certification.',
  },
];

const CSF_FUNCTION_ORDER = ['Govern', 'Identify', 'Protect', 'Detect', 'Respond', 'Recover'];

// ── Main Screen ───────────────────────────────────────────────

export default function FrameworksScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();

  const [selectedFramework, setSelectedFramework] = useState<Framework | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [functions, setFunctions] = useState<string[]>([]);
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const bg = isDark ? Colors.dark.bg : Colors.light.bg;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;

  const loadFramework = useCallback(async (fw: Framework) => {
    setLoading(true);
    setExpandedFunction(null);
    try {
      const [ctrls, funcs] = await Promise.all([
        getControlsByFramework(fw),
        getFunctionsByFramework(fw),
      ]);
      setControls(ctrls);
      // Sort CSF functions in canonical order
      if (fw === 'csf2') {
        setFunctions(CSF_FUNCTION_ORDER.filter((f) => funcs.includes(f)));
      } else {
        setFunctions(funcs);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedFramework) loadFramework(selectedFramework);
  }, [selectedFramework, loadFramework]);

  const handleControlPress = (control: Control) => {
    router.push({ pathname: '/control-detail', params: { controlId: control.control_id } });
  };

  const handleBookmark = async (control: Control) => {
    const already = bookmarkedIds.has(control.control_id);
    const next = new Set(bookmarkedIds);
    if (already) {
      await removeBookmark(control.control_id);
      next.delete(control.control_id);
    } else {
      await addBookmark(control.control_id);
      next.add(control.control_id);
    }
    setBookmarkedIds(next);
  };

  // Load bookmarks for visible controls
  useEffect(() => {
    if (!controls.length) return;
    Promise.all(controls.map((c) => isBookmarked(c.control_id))).then((results) => {
      const ids = new Set<string>();
      controls.forEach((c, i) => { if (results[i]) ids.add(c.control_id); });
      setBookmarkedIds(ids);
    });
  }, [controls]);

  if (!selectedFramework) {
    return <FrameworkList onSelect={setSelectedFramework} isDark={isDark} />;
  }

  const fw = FRAMEWORKS.find((f) => f.id === selectedFramework)!;
  const groupedByFunction = (func: string) =>
    controls.filter((c) => c.function_category === func);

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Back header */}
      <View
        style={{
          backgroundColor: isDark ? Colors.dark.card : Colors.primary.DEFAULT,
          paddingTop: Platform.OS === 'android' ? 8 : 0,
          paddingBottom: 12,
          paddingHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => setSelectedFramework(null)}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}
        >
          <Ionicons name="chevron-back" size={16} color={Colors.accent.DEFAULT} />
          <Text style={{ color: Colors.accent.DEFAULT, fontSize: 14, marginLeft: 2 }}>
            All Frameworks
          </Text>
        </TouchableOpacity>
        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>{fw.shortName}</Text>
        <Text style={{ color: '#FFFFFF99', fontSize: 13 }}>{fw.name}</Text>
      </View>

      {loading ? (
        <ScrollView>
          {[1, 2, 3, 4].map((i) => <ControlCardSkeleton key={i} />)}
        </ScrollView>
      ) : controls.length === 0 ? (
        <EmptyState
          icon="document-outline"
          title="No Controls Found"
          message="No controls are available for this framework yet."
        />
      ) : (
        <FlatList
          data={functions}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
          renderItem={({ item: func }) => {
            const funcControls = groupedByFunction(func);
            const isExpanded = expandedFunction === func;
            const color =
              selectedFramework === 'csf2'
                ? getCSFColor(func)
                : getFrameworkColor(selectedFramework);

            return (
              <FunctionSection
                func={func}
                controls={funcControls}
                color={color}
                isExpanded={isExpanded}
                onToggle={() => setExpandedFunction(isExpanded ? null : func)}
                onControlPress={handleControlPress}
                onBookmark={handleBookmark}
                bookmarkedIds={bookmarkedIds}
                isDark={isDark}
                textColor={textColor}
                mutedColor={mutedColor}
              />
            );
          }}
        />
      )}
    </View>
  );
}

// ── Framework List ────────────────────────────────────────────

function FrameworkList({
  onSelect,
  isDark,
}: {
  onSelect: (fw: Framework) => void;
  isDark: boolean;
}) {
  const bg = isDark ? Colors.dark.bg : Colors.light.bg;
  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={{ padding: 16 }}>
      {/* Hero banner */}
      <View
        style={{
          backgroundColor: Colors.primary.DEFAULT,
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          overflow: 'hidden',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="compass" size={28} color={Colors.accent.DEFAULT} />
          <Text
            style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginLeft: 10, letterSpacing: 0.5 }}
          >
            NIST Compass
          </Text>
        </View>
        <Text style={{ color: '#FFFFFFCC', fontSize: 14, lineHeight: 20 }}>
          Your offline NIST standards reference for cybersecurity, compliance, and risk management professionals.
        </Text>
        <View style={{ flexDirection: 'row', marginTop: 12, flexWrap: 'wrap', gap: 8 }}>
          {['GRC', 'Auditors', 'Healthcare', 'Finance', 'DoD/CMMC'].map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: Colors.accent.DEFAULT + '33',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: Colors.accent.DEFAULT + '55',
              }}
            >
              <Text style={{ color: Colors.accent.light, fontSize: 11, fontWeight: '600' }}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, marginBottom: 12, marginLeft: 4 }}>
        SELECT FRAMEWORK
      </Text>

      {FRAMEWORKS.map((fw) => (
        <TouchableOpacity
          key={fw.id}
          activeOpacity={0.75}
          onPress={() => onSelect(fw.id)}
          style={{
            backgroundColor: cardBg,
            borderRadius: 14,
            marginBottom: 12,
            borderWidth: 1,
            borderColor,
            overflow: 'hidden',
          }}
        >
          {/* Color accent bar */}
          <View style={{ height: 4, backgroundColor: fw.color }} />
          <View style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: fw.color + '22',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: fw.color + '44',
                }}
              >
                <Ionicons name={fw.icon} size={22} color={fw.color} />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>
                  {fw.shortName}
                </Text>
                <Text style={{ color: mutedColor, fontSize: 12, marginTop: 2 }}>{fw.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={mutedColor} />
            </View>
            <Text style={{ color: mutedColor, fontSize: 13, lineHeight: 18 }}>{fw.description}</Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Coming soon note */}
      <View
        style={{
          backgroundColor: isDark ? Colors.dark.cardAlt : Colors.light.cardAlt,
          borderRadius: 12,
          padding: 14,
          marginTop: 4,
          borderWidth: 1,
          borderColor,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Ionicons name="lock-closed" size={16} color={Colors.dark.muted} />
        <Text style={{ color: mutedColor, fontSize: 12, marginLeft: 8, flex: 1 }}>
          <Text style={{ fontWeight: '600' }}>Premium v2:</Text> Gap assessments, AI assistant, cross-framework mapping, PDF export, and team collaboration coming soon.
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Function Section (collapsible) ───────────────────────────

interface FunctionSectionProps {
  func: string;
  controls: Control[];
  color: string;
  isExpanded: boolean;
  onToggle: () => void;
  onControlPress: (c: Control) => void;
  onBookmark: (c: Control) => void;
  bookmarkedIds: Set<string>;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
}

function FunctionSection({
  func,
  controls,
  color,
  isExpanded,
  onToggle,
  onControlPress,
  onBookmark,
  bookmarkedIds,
  isDark,
  textColor,
  mutedColor,
}: FunctionSectionProps) {
  const rotation = React.useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotation]);

  const rotateInterp = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });

  const sectionBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;

  return (
    <View style={{ marginHorizontal: 16, marginBottom: 10 }}>
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.75}
        style={{
          backgroundColor: sectionBg,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          borderLeftWidth: 4,
          borderLeftColor: color,
          padding: 14,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: color + '22',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}
        >
          <Ionicons name="layers-outline" size={16} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: textColor, fontSize: 15, fontWeight: '700' }}>{func}</Text>
          <Text style={{ color: mutedColor, fontSize: 12, marginTop: 1 }}>
            {controls.length} control{controls.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <Animated.View style={{ transform: [{ rotate: rotateInterp }] }}>
          <Ionicons name="chevron-forward" size={18} color={mutedColor} />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={{ marginTop: 4 }}>
          {controls.map((control) => (
            <ControlCard
              key={control.control_id}
              control={control}
              onPress={onControlPress}
              onBookmark={onBookmark}
              isBookmarked={bookmarkedIds.has(control.control_id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
