import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import type { SavedBoard } from '@/types/board';
import { Colors, Spacing } from '@/constants/theme';

interface BoardCardProps {
  board: SavedBoard;
  onDelete: (id: string) => void;
}

/**
 * Renders a compact saved-board card for the Explore tab.
 */
export function BoardCard({ board, onDelete }: BoardCardProps) {
  const heroImage = board.images[0];

  const formattedDate = new Date(board.savedAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      {/* Color strip */}
      <View style={styles.colorStrip}>
        {board.colorPalette.map((s, i) => (
          <View key={i} style={[styles.colorChip, { backgroundColor: s.hex }]} />
        ))}
      </View>

      {/* Thumbnail */}
      {heroImage && (
        <Image
          source={{ uri: heroImage.url }}
          alt={heroImage.alt}
          style={styles.thumbnail}
          resizeMode="cover"
        />
      )}

      {/* Info */}
      <View style={styles.info}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {board.heading}
        </ThemedText>
        <ThemedText type="small" style={styles.date}>
          {formattedDate}
        </ThemedText>
        <ThemedText type="small" numberOfLines={2} style={styles.prompt}>
          {board.prompt}
        </ThemedText>
      </View>

      {/* Delete */}
      <Pressable
        style={({ pressed }) => [styles.deleteBtn, pressed && { opacity: 0.6 }]}
        onPress={() => onDelete(board.id)}
        accessibilityRole="button"
        accessibilityLabel="Delete saved board"
        hitSlop={8}
      >
        <ThemedText style={styles.deleteText}>×</ThemedText>
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.three,
    overflow: 'hidden',
    position: 'relative',
  },
  colorStrip: {
    flexDirection: 'row',
    height: 4,
  },
  colorChip: {
    flex: 1,
  },
  thumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.light.backgroundSelected,
  },
  info: {
    padding: Spacing.two,
    gap: 2,
  },
  date: {
    color: Colors.light.textSecondary,
    fontSize: 11,
  },
  prompt: {
    color: Colors.light.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  deleteBtn: {
    position: 'absolute',
    top: Spacing.one,
    right: Spacing.one,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '300',
  },
});
