import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Share,
  Alert,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getCSFColor, getFrameworkColor } from '../src/theme/colors';
import { useControlDetail } from '../src/hooks/useDatabase';
import { getControlById } from '../src/database/queries';
import { Control } from '../src/types';

const FRAMEWORK_LABELS: Record<string, string> = {
  csf2: 'NIST CSF 2.0',
  sp80053: 'NIST SP 800-53 Rev 5',
  sp800171: 'NIST SP 800-171',
};

export default function ControlDetailScreen() {
  const params = useLocalSearchParams<{ controlId: string }>();
  const controlId = params.controlId ?? '';
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const navigation = useNavigation();

  const { control, loading, bookmarked, toggleBookmark } = useControlDetail(controlId);
  const [relatedControls, setRelatedControls] = useState<Control[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'guidance' | 'related'>('overview');

  const bg = isDark ? Colors.dark.bg : Colors.light.bg;
  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;

  const functionColor = control
    ? control.framework === 'csf2'
      ? getCSFColor(control.function_category)
      : getFrameworkColor(control.framework)
    : Colors.accent.DEFAULT;

  // Set header buttons
  useEffect(() => {
    if (!control) return;
    navigation.setOptions({
      title: control.control_id,
      headerRight: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleShare}
            style={{ marginRight: 16 }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="share-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleBookmarkPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={bookmarked ? 'bookmark' : 'bookmark-outline'}
              size={22}
              color={bookmarked ? Colors.accent.DEFAULT : '#FFFFFF'}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [control, bookmarked, navigation]);

  // Load related controls
  useEffect(() => {
    if (!control?.related_controls?.length) return;
    Promise.all(
      control.related_controls.slice(0, 5).map((id) => getControlById(id))
    ).then((results) => {
      setRelatedControls(results.filter(Boolean) as Control[]);
    });
  }, [control]);

  const handleBookmarkPress = () => {
    if (!bookmarked) {
      setShowNoteModal(true);
    } else {
      Alert.alert('Remove Bookmark', 'Remove this bookmark?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => toggleBookmark() },
      ]);
    }
  };

  const handleSaveBookmark = async () => {
    await toggleBookmark(noteText);
    setShowNoteModal(false);
    setNoteText('');
  };

  const handleShare = async () => {
    if (!control) return;
    await Share.share({
      title: `${control.control_id}: ${control.title}`,
      message: `${FRAMEWORK_LABELS[control.framework]}\n\n${control.control_id}: ${control.title}\n\n${control.description}\n\nShared from NIST Compass`,
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
        <ActivityIndicator size="large" color={Colors.accent.DEFAULT} />
      </View>
    );
  }

  if (!control) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: bg }}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.status.error} />
        <Text style={{ color: textColor, fontSize: 16, marginTop: 12 }}>Control not found</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: bg }} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero header */}
        <View
          style={{
            backgroundColor: Colors.primary.DEFAULT,
            padding: 20,
            paddingTop: 16,
          }}
        >
          {/* Framework badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <View
              style={{
                backgroundColor: getFrameworkColor(control.framework) + '33',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: getFrameworkColor(control.framework) + '66',
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: getFrameworkColor(control.framework) === Colors.frameworks.csf2
                    ? Colors.accent.light
                    : '#FFFFFF',
                  fontSize: 12,
                  fontWeight: '700',
                }}
              >
                {FRAMEWORK_LABELS[control.framework]}
              </Text>
            </View>
            <View
              style={{
                backgroundColor: functionColor + '33',
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderWidth: 1,
                borderColor: functionColor + '66',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: functionColor, marginRight: 5 }} />
                <Text style={{ color: functionColor === Colors.csf.Govern ? '#D8B4FE' : '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                  {control.function_category}
                </Text>
              </View>
            </View>
          </View>

          {/* Control ID */}
          <Text style={{ color: Colors.accent.DEFAULT, fontSize: 28, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 }}>
            {control.control_id}
          </Text>

          {/* Title */}
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '600', lineHeight: 24 }}>
            {control.title}
          </Text>

          {/* Family */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Ionicons name="folder-outline" size={13} color="#FFFFFF88" />
            <Text style={{ color: '#FFFFFF88', fontSize: 13, marginLeft: 5 }}>{control.family}</Text>
          </View>
        </View>

        {/* Tabs */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
            borderBottomWidth: 1,
            borderBottomColor: borderColor,
          }}
        >
          {(['overview', 'guidance', 'related'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab ? Colors.accent.DEFAULT : 'transparent',
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: activeTab === tab ? '700' : '400',
                  color: activeTab === tab ? Colors.accent.DEFAULT : mutedColor,
                  textTransform: 'capitalize',
                }}
              >
                {tab === 'guidance' ? 'Guidance' : tab === 'related' ? `Related (${relatedControls.length})` : 'Overview'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab content */}
        <View style={{ padding: 16 }}>
          {activeTab === 'overview' && (
            <OverviewTab control={control} isDark={isDark} textColor={textColor} mutedColor={mutedColor} cardBg={cardBg} borderColor={borderColor} functionColor={functionColor} />
          )}
          {activeTab === 'guidance' && (
            <GuidanceTab control={control} isDark={isDark} textColor={textColor} mutedColor={mutedColor} cardBg={cardBg} borderColor={borderColor} />
          )}
          {activeTab === 'related' && (
            <RelatedTab
              relatedControls={relatedControls}
              rawRelated={control.related_controls}
              isDark={isDark}
              textColor={textColor}
              mutedColor={mutedColor}
              cardBg={cardBg}
              borderColor={borderColor}
            />
          )}
        </View>
      </ScrollView>

      {/* Note modal */}
      <Modal visible={showNoteModal} transparent animationType="slide" onRequestClose={() => setShowNoteModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              paddingBottom: 32,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Ionicons name="bookmark" size={20} color={Colors.accent.DEFAULT} />
              <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', flex: 1, marginLeft: 8 }}>
                Bookmark Control
              </Text>
              <TouchableOpacity onPress={() => setShowNoteModal(false)}>
                <Ionicons name="close" size={24} color={mutedColor} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 12 }}>
              Add an optional personal note to remember why you saved this control.
            </Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              multiline
              placeholder="Optional note (e.g., 'Relevant for Q3 audit scope')"
              placeholderTextColor={mutedColor}
              style={{
                backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg,
                borderRadius: 10,
                borderWidth: 1,
                borderColor,
                padding: 12,
                color: textColor,
                fontSize: 14,
                minHeight: 80,
                textAlignVertical: 'top',
                marginBottom: 16,
              }}
            />
            <TouchableOpacity
              onPress={handleSaveBookmark}
              style={{ backgroundColor: Colors.accent.DEFAULT, borderRadius: 12, padding: 14, alignItems: 'center' }}
            >
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>
                <Ionicons name="bookmark" size={15} /> Save Bookmark
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

// ── Tab Components ────────────────────────────────────────────

function Section({ title, children, isDark, cardBg, borderColor }: {
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  cardBg: string;
  borderColor: string;
}) {
  return (
    <View
      style={{
        backgroundColor: cardBg,
        borderRadius: 12,
        borderWidth: 1,
        borderColor,
        marginBottom: 12,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          backgroundColor: isDark ? Colors.dark.cardAlt : Colors.light.cardAlt,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <Text style={{ color: isDark ? Colors.dark.muted : Colors.light.muted, fontSize: 11, fontWeight: '700', letterSpacing: 0.8 }}>
          {title.toUpperCase()}
        </Text>
      </View>
      <View style={{ padding: 14 }}>{children}</View>
    </View>
  );
}

function OverviewTab({ control, isDark, textColor, mutedColor, cardBg, borderColor, functionColor }: {
  control: Control;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
  functionColor: string;
}) {
  return (
    <>
      <Section title="Description" isDark={isDark} cardBg={cardBg} borderColor={borderColor}>
        <Text style={{ color: textColor, fontSize: 15, lineHeight: 24 }}>{control.description}</Text>
      </Section>

      <Section title="Control Metadata" isDark={isDark} cardBg={cardBg} borderColor={borderColor}>
        <MetaRow label="Control ID" value={control.control_id} textColor={textColor} mutedColor={mutedColor} valueColor={functionColor} />
        <MetaRow label="Framework" value={FRAMEWORK_LABELS[control.framework]} textColor={textColor} mutedColor={mutedColor} />
        <MetaRow label="Function / Category" value={control.function_category} textColor={textColor} mutedColor={mutedColor} valueColor={functionColor} />
        <MetaRow label="Family" value={control.family} textColor={textColor} mutedColor={mutedColor} isLast />
      </Section>

      {control.tags.length > 0 && (
        <Section title="Tags" isDark={isDark} cardBg={cardBg} borderColor={borderColor}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {control.tags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: Colors.accent.DEFAULT + '22',
                  borderRadius: 6,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderWidth: 1,
                  borderColor: Colors.accent.DEFAULT + '44',
                }}
              >
                <Text style={{ color: Colors.accent.DEFAULT, fontSize: 12, fontWeight: '600' }}>#{tag}</Text>
              </View>
            ))}
          </View>
        </Section>
      )}
    </>
  );
}

function GuidanceTab({ control, isDark, textColor, mutedColor, cardBg, borderColor }: {
  control: Control;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}) {
  const paragraphs = control.implementation_guidance
    .split('. ')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <>
      <View
        style={{
          backgroundColor: Colors.accent.DEFAULT + '15',
          borderRadius: 10,
          padding: 12,
          marginBottom: 12,
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: Colors.accent.DEFAULT + '33',
        }}
      >
        <Ionicons name="information-circle-outline" size={18} color={Colors.accent.DEFAULT} />
        <Text style={{ color: Colors.accent.DEFAULT, fontSize: 13, marginLeft: 8, flex: 1, lineHeight: 18 }}>
          Practical guidance for implementing this control in your organization.
        </Text>
      </View>

      <Section title="Implementation Guidance" isDark={isDark} cardBg={cardBg} borderColor={borderColor}>
        {paragraphs.map((para, i) => (
          <View key={i} style={{ flexDirection: 'row', marginBottom: i < paragraphs.length - 1 ? 10 : 0 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: Colors.accent.DEFAULT,
                marginTop: 8,
                marginRight: 10,
                flexShrink: 0,
              }}
            />
            <Text style={{ color: textColor, fontSize: 14, lineHeight: 22, flex: 1 }}>
              {para}{!para.endsWith('.') ? '.' : ''}
            </Text>
          </View>
        ))}
      </Section>
    </>
  );
}

function RelatedTab({ relatedControls, rawRelated, isDark, textColor, mutedColor, cardBg, borderColor }: {
  relatedControls: Control[];
  rawRelated: string[];
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}) {
  if (rawRelated.length === 0) {
    return (
      <View style={{ alignItems: 'center', padding: 32 }}>
        <Ionicons name="git-network-outline" size={40} color={mutedColor} />
        <Text style={{ color: mutedColor, marginTop: 12, textAlign: 'center' }}>
          No related controls listed for this control.
        </Text>
      </View>
    );
  }

  return (
    <>
      <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 12, lineHeight: 18 }}>
        Related controls help you build a comprehensive security posture by addressing complementary requirements.
      </Text>
      {relatedControls.length > 0 ? (
        relatedControls.map((rc) => {
          const color =
            rc.framework === 'csf2'
              ? getCSFColor(rc.function_category)
              : getFrameworkColor(rc.framework);
          return (
            <View
              key={rc.control_id}
              style={{
                backgroundColor: cardBg,
                borderRadius: 10,
                borderWidth: 1,
                borderColor,
                borderLeftWidth: 4,
                borderLeftColor: color,
                padding: 12,
                marginBottom: 8,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View
                  style={{
                    backgroundColor: color + '22',
                    borderRadius: 5,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    borderWidth: 1,
                    borderColor: color + '44',
                  }}
                >
                  <Text style={{ color, fontSize: 11, fontWeight: '700' }}>{rc.control_id}</Text>
                </View>
                <Text style={{ color: mutedColor, fontSize: 11, marginLeft: 8 }}>{FRAMEWORK_LABELS[rc.framework]}</Text>
              </View>
              <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>{rc.title}</Text>
              <Text style={{ color: mutedColor, fontSize: 12, marginTop: 3 }} numberOfLines={2}>
                {rc.description}
              </Text>
            </View>
          );
        })
      ) : (
        // Show as plain text if controls not in DB
        rawRelated.map((id) => (
          <View
            key={id}
            style={{
              backgroundColor: cardBg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor,
              padding: 12,
              marginBottom: 8,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Ionicons name="link-outline" size={16} color={mutedColor} />
            <Text style={{ color: textColor, fontSize: 14, marginLeft: 8, fontWeight: '600' }}>{id}</Text>
          </View>
        ))
      )}
    </>
  );
}

function MetaRow({
  label, value, textColor, mutedColor, valueColor, isLast,
}: {
  label: string;
  value: string;
  textColor: string;
  mutedColor: string;
  valueColor?: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: mutedColor + '22',
      }}
    >
      <Text style={{ color: mutedColor, fontSize: 13, flex: 1 }}>{label}</Text>
      <Text
        style={{
          color: valueColor ?? textColor,
          fontSize: 13,
          fontWeight: '600',
          flex: 1.5,
          textAlign: 'right',
        }}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}
