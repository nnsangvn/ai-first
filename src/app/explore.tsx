import React, { useCallback } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useBoardContext } from '@/context/board-context';
import { BoardCard } from '@/components/board-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';

/* ─── Login prompt button (SAN-15) ─────────────────────────────────────────── */

function LoginPrompt() {
  const handleLogin = useCallback(() => {
    Alert.alert(
      'Sign in coming soon',
      'Cloud sync and account features will be available in a future update.',
      [{ text: 'OK' }],
    );
  }, []);

  return (
    <Pressable
      style={({ pressed }) => [styles.loginButton, pressed && { opacity: 0.8 }]}
      onPress={handleLogin}
      accessibilityRole="button"
      accessibilityLabel="Sign in or create an account"
    >
      <ThemedText type="smallBold" style={styles.loginButtonText}>
        Sign in / Create Account
      </ThemedText>
    </Pressable>
  );
}

/* ─── Empty state ──────────────────────────────────────────────────────────── */

function EmptyState() {
  return (
    <View style={styles.empty}>
      <ThemedText type="subtitle" style={styles.emptyTitle}>
        No saved boards yet
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.emptyText}>
        Generate a concept board on the Home tab and tap &ldquo;Save Board&rdquo; to see it here.
      </ThemedText>
    </View>
  );
}

/* ─── Screen ───────────────────────────────────────────────────────────────── */

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { savedBoards, deleteBoard } = useBoardContext();

  const handleDelete = useCallback(
    async (id: string) => {
      Alert.alert('Delete board?', 'This cannot be undone.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteBoard(id);
          },
        },
      ]);
    },
    [deleteBoard],
  );

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { paddingBottom: Spacing.three }]}>
        <ThemedText type="subtitle">Explore</ThemedText>
        <LoginPrompt />
      </View>

      {/* Board list */}
      <FlatList
        data={savedBoards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BoardCard board={item} onDelete={handleDelete} />}
        ListEmptyComponent={<EmptyState />}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.three },
        ]}
        ItemSeparatorComponent={() => <View style={{ height: Spacing.two }} />}
      />
    </ThemedView>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    gap: Spacing.two,
  },
  loginButton: {
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  loginButtonText: {
    color: '#ffffff',
  },
  list: {
    paddingHorizontal: Spacing.three,
    flexGrow: 1,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.six,
    paddingHorizontal: Spacing.four,
    gap: Spacing.two,
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
  },
});
