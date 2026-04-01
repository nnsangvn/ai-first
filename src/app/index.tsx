import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '@/context/auth-context';
import { useBoardContext } from '@/context/board-context';
import { PromptInput } from '@/components/prompt-input';
import { ConceptBoardDisplay } from '@/components/concept-board-display';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

/* ─── Inner screen (has context access) ─────────────────────────────────────── */

function HomeScreenInner() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { status, currentBoard, error, generateBoard, saveCurrentBoard } = useBoardContext();
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerate = (prompt: string) => {
    void generateBoard(prompt);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveCurrentBoard();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ThemedView style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + BottomTabInset + Spacing.four },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header: user greeting + sign-out */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <ThemedText type="subtitle">
              {user ? `Hi, ${user.displayName}` : 'Hi there'}
            </ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.subtitle}>
              What would you like to create today?
            </ThemedText>
          </View>
          {user && (
            <Pressable
              onPress={signOut}
              style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.7 }]}
              accessibilityRole="button"
              accessibilityLabel="Sign out"
            >
              <ThemedText type="small" style={styles.signOutText}>
                Sign out
              </ThemedText>
            </Pressable>
          )}
        </View>

        {/* Prompt input */}
        <PromptInput onSubmit={handleGenerate} isLoading={status === 'loading'} />

        {/* Loading */}
        {status === 'loading' && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#208AEF" />
            <ThemedText type="small" themeColor="textSecondary" style={styles.loadingText}>
              Crafting your concept board…
            </ThemedText>
          </View>
        )}

        {/* Error */}
        {status === 'error' && error && (
          <ThemedView type="backgroundElement" style={styles.errorBox}>
            <ThemedText type="smallBold" style={styles.errorTitle}>
              Something went wrong
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {error.message}
            </ThemedText>
          </ThemedView>
        )}

        {/* Board */}
        {status === 'success' && currentBoard && (
          <ConceptBoardDisplay
            board={currentBoard}
            onSave={handleSave}
            isSaving={isSaving}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

export default function HomePage() {
  return <HomeScreenInner />;
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
    padding: Spacing.three,
    gap: Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    gap: Spacing.one,
  },
  subtitle: {
    fontSize: 14,
  },
  signOutBtn: {
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    borderRadius: Spacing.two,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  signOutText: {
    color: '#6b7280',
    fontSize: 13,
  },
  center: {
    alignItems: 'center',
    paddingVertical: Spacing.five,
    gap: Spacing.two,
  },
  loadingText: {
    marginTop: Spacing.one,
  },
  errorBox: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  errorTitle: {
    color: '#e53e3e',
  },
});
