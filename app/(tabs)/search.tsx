import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Framework } from '../../src/types';
import { Colors, getFrameworkColor } from '../../src/theme/colors';
import { ControlCard } from '../../src/components/ControlCard';
import { FilterRow } from '../../src/components/FilterChip';
import { EmptyState } from '../../src/components/EmptyState';
import { useSearch } from '../../src/hooks/useDatabase';
import {
  isBookmarked,
  addBookmark,
  removeBookmark,
} from '../../src/database/queries';

const FRAMEWORK_OPTIONS: { label: string; value: Framework | undefined; color?: string }[] = [
  { label: 'All', value: undefined },
  { label: 'CSF 2.0', value: 'csf2', color: Colors.frameworks.csf2 },
  { label: 'SP 800-53', value: 'sp80053', color: Colors.frameworks.sp80053 },
  { label: 'SP 800-171', value: 'sp800171', color: Colors.frameworks.sp800171 },
];

export default function SearchScreen() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const router = useRouter();

  const {
    query, setQuery,
    framework, setFramework,
    family, setFamily,
    results, loading,
    families,
  } = useSearch();

  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  const bg = isDark ? Colors.dark.bg : Colors.light.bg;
  const cardBg = isDark ? Colors.dark.card : Colors.light.card;
  const borderColor = isDark ? Colors.dark.border : Colors.light.border;
  const textColor = isDark ? Colors.dark.text : Colors.light.text;
  const mutedColor = isDark ? Colors.dark.muted : Colors.light.muted;
  const placeholderColor = isDark ? Colors.dark.subtle : Colors.light.subtle;

  useEffect(() => {
    if (!results.length) return;
    Promise.all(results.map((c) => isBookmarked(c.control_id))).then((bms) => {
      const ids = new Set<string>();
      results.forEach((c, i) => { if (bms[i]) ids.add(c.control_id); });
      setBookmarkedIds(ids);
    });
  }, [results]);

  const handleBookmark = useCallback(async (control: { control_id: string }) => {
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
  }, [bookmarkedIds]);

  const familyOptions = [
    { label: 'All Families', value: undefined as string | undefined },
    ...families.map((f) => ({
      label: f,
      value: f,
      color: framework ? getFrameworkColor(framework) : undefined,
    })),
  ];

  const hasQuery = query.length > 0;
  const hasFilters = !!framework || !!family;
  const showResults = hasQuery || hasFilters;

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Search bar */}
      <View
        style={{
          backgroundColor: isDark ? Colors.dark.card : Colors.primary.DEFAULT,
          paddingHorizontal: 16,
          paddingTop: Platform.OS === 'android' ? 8 : 4,
          paddingBottom: 12,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? Colors.dark.bg : '#FFFFFF22',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: isDark ? borderColor : '#FFFFFF44',
            paddingHorizontal: 12,
            height: 44,
          }}
        >
          <Ionicons name="search" size={18} color={isDark ? mutedColor : '#FFFFFFAA'} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search controls, IDs, keywords…"
            placeholderTextColor={isDark ? placeholderColor : '#FFFFFFAA'}
            style={{
              flex: 1,
              marginLeft: 8,
              fontSize: 15,
              color: isDark ? textColor : '#FFFFFF',
            }}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {loading && (
            <ActivityIndicator size="small" color={isDark ? Colors.accent.DEFAULT : '#FFFFFF'} />
          )}
          {query.length > 0 && !loading && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={isDark ? mutedColor : '#FFFFFFAA'} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Framework filter */}
      <View style={{ backgroundColor: isDark ? Colors.dark.cardAlt : Colors.light.cardAlt, borderBottomWidth: 1, borderBottomColor: borderColor }}>
        <FilterRow
          options={FRAMEWORK_OPTIONS}
          selected={framework}
          onSelect={(val) => setFramework(val as Framework | undefined)}
        />
      </View>

      {/* Family filter (only if framework selected) */}
      {framework && families.length > 0 && (
        <View style={{ backgroundColor: isDark ? Colors.dark.bg : Colors.light.bg, borderBottomWidth: 1, borderBottomColor: borderColor }}>
          <FilterRow
            options={familyOptions}
            selected={family}
            onSelect={setFamily}
          />
        </View>
      )}

      {/* Results */}
      {!showResults ? (
        <SearchHints isDark={isDark} textColor={textColor} mutedColor={mutedColor} cardBg={cardBg} borderColor={borderColor} />
      ) : loading && results.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.accent.DEFAULT} />
          <Text style={{ color: mutedColor, marginTop: 12, fontSize: 14 }}>Searching…</Text>
        </View>
      ) : results.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No Controls Found"
          message={`No controls match "${query}". Try different keywords or adjust your filters.`}
        />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.control_id}
          contentContainerStyle={{ paddingVertical: 8, paddingBottom: 24 }}
          ListHeaderComponent={
            <View style={{ paddingHorizontal: 16, paddingVertical: 6 }}>
              <Text style={{ color: mutedColor, fontSize: 13 }}>
                {results.length} result{results.length !== 1 ? 's' : ''}
                {query ? ` for "${query}"` : ''}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ControlCard
              control={item}
              onPress={(c) =>
                router.push({ pathname: '/control-detail', params: { controlId: c.control_id } })
              }
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds.has(item.control_id)}
              showFramework
            />
          )}
        />
      )}
    </View>
  );
}

function SearchHints({
  isDark,
  textColor,
  mutedColor,
  cardBg,
  borderColor,
}: {
  isDark: boolean;
  textColor: string;
  mutedColor: string;
  cardBg: string;
  borderColor: string;
}) {
  const hints = [
    { icon: 'key-outline' as const, label: 'Try: "access control"' },
    { icon: 'shield-outline' as const, label: 'Try: "encryption"' },
    { icon: 'bug-outline' as const, label: 'Try: "incident response"' },
    { icon: 'eye-outline' as const, label: 'Try: "monitoring"' },
    { icon: 'cloud-outline' as const, label: 'Try control IDs: "AC-2", "PR.AA-01"' },
  ];

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ color: textColor, fontSize: 17, fontWeight: '700', marginBottom: 4 }}>
        Search All Frameworks
      </Text>
      <Text style={{ color: mutedColor, fontSize: 14, marginBottom: 20, lineHeight: 20 }}>
        Full-text search across CSF 2.0, SP 800-53, and SP 800-171. Filter by framework and family.
      </Text>

      <Text style={{ color: mutedColor, fontSize: 12, fontWeight: '600', letterSpacing: 0.8, marginBottom: 12 }}>
        SEARCH SUGGESTIONS
      </Text>

      {hints.map((h) => (
        <View
          key={h.label}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: cardBg,
            borderRadius: 10,
            padding: 12,
            marginBottom: 8,
            borderWidth: 1,
            borderColor,
          }}
        >
          <Ionicons name={h.icon} size={16} color={Colors.accent.DEFAULT} />
          <Text style={{ color: mutedColor, fontSize: 14, marginLeft: 10 }}>{h.label}</Text>
        </View>
      ))}
    </View>
  );
}
