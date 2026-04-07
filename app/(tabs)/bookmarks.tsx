import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  TextInput,
  Alert,
  Animated,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Bookmark, Framework } from '../../src/types';
import { Colors, getFrameworkColor } from '../../src/theme/colors';
import { EmptyState } from '../../src/components/EmptyState';
import { useBookmarks } from '../../src/hooks/useDatabase';

const FRAMEWORK_LABELS: Record<string, string> = {
  csf2: 'CSF 2.0',
  sp80053: 'SP 800-53',
  sp800171: 'SP 800-171',
};

export default function BookmarksScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();
  const { bookmarks, loading, refresh, remove, updateNote } = useBookmarks();
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const [noteText, setNoteText] = useState('');
  const [filterFw, setFilterFw] = useState<Framework | undefined>();

  const bg = isDark ? Colors.dark.bg : Colors.light.bg;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;

  // Refresh when screen comes into focus
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));

  const grouped = React.useMemo(() => {
    const filtered = filterFw
      ? bookmarks.filter((b) => b.control?.framework === filterFw)
      : bookmarks;

    const map = new Map<string, Bookmark[]>();
    filtered.forEach((b) => {
      const fw = b.control?.framework ?? 'unknown';
      if (!map.has(fw)) map.set(fw, []);
      map.get(fw)!.push(b);
    });
    return map;
  }, [bookmarks, filterFw]);

  const allFrameworks = React.useMemo(() => {
    const fws = new Set<Framework>();
    bookmarks.forEach((b) => { if (b.control?.framework) fws.add(b.control.framework as Framework); });
    return Array.from(fws);
  }, [bookmarks]);

  const handleDelete = (controlId: string) => {
    Alert.alert('Remove Bookmark', 'Remove this bookmark?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => remove(controlId) },
    ]);
  };

  const openNoteEditor = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setNoteText(bookmark.note);
  };

  const saveNote = async () => {
    if (!editingBookmark) return;
    await updateNote(editingBookmark.control_id, noteText);
    setEditingBookmark(null);
  };

  if (!loading && bookmarks.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: bg }}>
        <EmptyState
          icon="bookmark-outline"
          title="No Bookmarks Yet"
          message="Tap the bookmark icon on any control to save it here for quick reference."
          iconColor={Colors.accent.DEFAULT}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Filter bar */}
      {allFrameworks.length > 1 && (
        <View
          style={{
            backgroundColor: isDark ? Colors.dark.card : Colors.light.card,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? Colors.dark.border : Colors.light.border,
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingVertical: 8,
          }}
        >
          <TouchableOpacity
            onPress={() => setFilterFw(undefined)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: !filterFw ? Colors.accent.DEFAULT : 'transparent',
              borderWidth: 1,
              borderColor: !filterFw ? Colors.accent.DEFAULT : (isDark ? Colors.dark.border : Colors.light.border),
              marginRight: 8,
            }}
          >
            <Text style={{ color: !filterFw ? '#FFF' : mutedColor, fontSize: 12, fontWeight: '600' }}>
              All ({bookmarks.length})
            </Text>
          </TouchableOpacity>
          {allFrameworks.map((fw) => {
            const color = getFrameworkColor(fw);
            const count = bookmarks.filter((b) => b.control?.framework === fw).length;
            return (
              <TouchableOpacity
                key={fw}
                onPress={() => setFilterFw(filterFw === fw ? undefined : fw)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 16,
                  backgroundColor: filterFw === fw ? color : 'transparent',
                  borderWidth: 1,
                  borderColor: filterFw === fw ? color : (isDark ? Colors.dark.border : Colors.light.border),
                  marginRight: 8,
                }}
              >
                <Text style={{ color: filterFw === fw ? '#FFF' : mutedColor, fontSize: 12, fontWeight: '600' }}>
                  {FRAMEWORK_LABELS[fw]} ({count})
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <FlatList
        data={Array.from(grouped.entries())}
        keyExtractor={([fw]) => fw}
        contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        renderItem={({ item: [fw, items] }) => (
          <FrameworkBookmarkGroup
            framework={fw}
            bookmarks={items}
            isDark={isDark}
            textColor={textColor}
            mutedColor={mutedColor}
            onPress={(b) =>
              router.push({ pathname: '/control-detail', params: { controlId: b.control_id } })
            }
            onDelete={handleDelete}
            onEditNote={openNoteEditor}
          />
        )}
      />

      {/* Note editor modal */}
      <Modal
        visible={!!editingBookmark}
        transparent
        animationType="slide"
        onRequestClose={() => setEditingBookmark(null)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: 'flex-end' }}
        >
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
              <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', flex: 1 }}>
                Edit Note
              </Text>
              <TouchableOpacity onPress={() => setEditingBookmark(null)}>
                <Ionicons name="close" size={24} color={mutedColor} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: mutedColor, fontSize: 13, marginBottom: 8 }}>
              {editingBookmark?.control_id} · {editingBookmark?.control?.title}
            </Text>
            <TextInput
              value={noteText}
              onChangeText={setNoteText}
              multiline
              placeholder="Add your notes here…"
              placeholderTextColor={mutedColor}
              style={{
                backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: isDark ? Colors.dark.border : Colors.light.border,
                padding: 12,
                color: textColor,
                fontSize: 14,
                minHeight: 100,
                textAlignVertical: 'top',
                marginBottom: 16,
              }}
              autoFocus
            />
            <TouchableOpacity
              onPress={saveNote}
              style={{
                backgroundColor: Colors.accent.DEFAULT,
                borderRadius: 12,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 15 }}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

// ── Framework Group ───────────────────────────────────────────

interface GroupProps {
  framework: string;
  bookmarks: Bookmark[];
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  onPress: (b: Bookmark) => void;
  onDelete: (id: string) => void;
  onEditNote: (b: Bookmark) => void;
}

function FrameworkBookmarkGroup({
  framework,
  bookmarks,
  isDark,
  textColor,
  mutedColor,
  onPress,
  onDelete,
  onEditNote,
}: GroupProps) {
  const color = getFrameworkColor(framework);
  const label = FRAMEWORK_LABELS[framework] ?? framework;

  return (
    <View style={{ marginBottom: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 }}>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color, marginRight: 8 }} />
        <Text style={{ color: color, fontSize: 12, fontWeight: '700', letterSpacing: 0.6 }}>
          {label.toUpperCase()} · {bookmarks.length}
        </Text>
      </View>
      {bookmarks.map((b) => (
        <SwipeableBookmarkCard
          key={b.id}
          bookmark={b}
          isDark={isDark}
          textColor={textColor}
          mutedColor={mutedColor}
          color={color}
          onPress={() => onPress(b)}
          onDelete={() => onDelete(b.control_id)}
          onEditNote={() => onEditNote(b)}
        />
      ))}
    </View>
  );
}

// ── Swipeable Bookmark Card ───────────────────────────────────

interface CardProps {
  bookmark: Bookmark;
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  color: string;
  onPress: () => void;
  onDelete: () => void;
  onEditNote: () => void;
}

function SwipeableBookmarkCard({
  bookmark,
  isDark,
  textColor,
  mutedColor,
  color,
  onPress,
  onDelete,
  onEditNote,
}: CardProps) {
  const swipeRef = useRef<Swipeable>(null);

  const renderRightActions = (_: unknown, dragX: Animated.AnimatedInterpolation<number>) => {
    const opacity = dragX.interpolate({ inputRange: [-80, 0], outputRange: [1, 0], extrapolate: 'clamp' });
    return (
      <Animated.View style={{ opacity, flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
        <TouchableOpacity
          onPress={() => { swipeRef.current?.close(); onEditNote(); }}
          style={{
            backgroundColor: Colors.status.info,
            borderRadius: 10,
            width: 56,
            height: '85%' as unknown as number,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
          }}
        >
          <Ionicons name="create-outline" size={22} color="#FFF" />
          <Text style={{ color: '#FFF', fontSize: 10, marginTop: 2 }}>Note</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => { swipeRef.current?.close(); onDelete(); }}
          style={{
            backgroundColor: Colors.status.error,
            borderRadius: 10,
            width: 56,
            height: '85%' as unknown as number,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="trash-outline" size={22} color="#FFF" />
          <Text style={{ color: '#FFF', fontSize: 10, marginTop: 2 }}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;
  const preview = bookmark.control?.description?.substring(0, 80) + '…';
  const dateStr = new Date(bookmark.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Swipeable ref={swipeRef} renderRightActions={renderRightActions} overshootRight={false}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={{
          backgroundColor: cardBg,
          marginHorizontal: 16,
          marginVertical: 4,
          borderRadius: 12,
          borderWidth: 1,
          borderColor,
          borderLeftWidth: 4,
          borderLeftColor: color,
          padding: 14,
        }}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <View
            style={{
              backgroundColor: color + '22',
              borderRadius: 6,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: color + '55',
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color }}>{bookmark.control_id}</Text>
          </View>
          <View style={{ flex: 1 }} />
          <Ionicons name="bookmark" size={16} color={Colors.accent.DEFAULT} />
        </View>

        {/* Title */}
        <Text style={{ color: textColor, fontSize: 15, fontWeight: '600', marginBottom: 4 }} numberOfLines={2}>
          {bookmark.control?.title ?? bookmark.control_id}
        </Text>

        {/* Description preview */}
        <Text style={{ color: mutedColor, fontSize: 13, lineHeight: 18, marginBottom: 6 }} numberOfLines={2}>
          {preview}
        </Text>

        {/* Note */}
        {bookmark.note ? (
          <View
            style={{
              backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg,
              borderRadius: 8,
              padding: 8,
              marginTop: 4,
              borderLeftWidth: 2,
              borderLeftColor: Colors.accent.DEFAULT,
            }}
          >
            <Text style={{ color: Colors.accent.DEFAULT, fontSize: 11, fontWeight: '600', marginBottom: 2 }}>
              MY NOTE
            </Text>
            <Text style={{ color: textColor, fontSize: 13 }} numberOfLines={2}>
              {bookmark.note}
            </Text>
          </View>
        ) : null}

        {/* Footer */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Ionicons name="calendar-outline" size={11} color={mutedColor} />
          <Text style={{ color: mutedColor, fontSize: 11, marginLeft: 4 }}>Saved {dateStr}</Text>
          <View style={{ flex: 1 }} />
          <Text style={{ color: mutedColor, fontSize: 11 }}>Swipe for options →</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}
