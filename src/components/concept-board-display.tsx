import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { ThemedText } from '@/components/themed-text';
import type { ConceptBoard } from '@/types/board';
import { Colors, Spacing } from '@/constants/theme';

interface ConceptBoardDisplayProps {
  board: ConceptBoard;
  onSave: () => void;
  isSaving: boolean;
}

/* ─── Color Swatch ─────────────────────────────────────────────────────────── */

interface ColorSwatchItemProps {
  hex: string;
  name: string;
}

function ColorSwatchItem({ hex, name }: ColorSwatchItemProps) {
  const [copied, setCopied] = useState(false);

  const copyHex = async () => {
    await Clipboard.setStringAsync(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.swatch, { backgroundColor: hex }, pressed && { opacity: 0.8 }]}
      onPress={copyHex}
      accessibilityRole="button"
      accessibilityLabel={`Color ${name}, ${hex}. Tap to copy.`}
    >
      <ThemedText type="smallBold" style={[styles.swatchText, isLight(hex) && styles.swatchTextDark]}>
        {copied ? 'Copied!' : hex}
      </ThemedText>
      <ThemedText
        type="small"
        style={[styles.swatchName, isLight(hex) && styles.swatchTextDark]}
        numberOfLines={1}
      >
        {name}
      </ThemedText>
    </Pressable>
  );
}

/** True if the hex color is light (contrast threshold) */
function isLight(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 128;
}

/* ─── ConceptBoardDisplay ──────────────────────────────────────────────────── */

export function ConceptBoardDisplay({ board, onSave, isSaving }: ConceptBoardDisplayProps) {
  const heroImage = board.images[0];
  const thumbImages = board.images.slice(1, 3);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} bounces={false}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.heading}>
          {board.heading}
        </ThemedText>
        <ThemedText type="small" style={styles.promptLabel}>
          "{board.prompt}"
        </ThemedText>
      </View>

      {/* Hero image */}
      {heroImage && (
        <Image
          source={{ uri: heroImage.url }}
          alt={heroImage.alt}
          style={styles.heroImage}
          resizeMode="cover"
          accessibilityLabel={heroImage.alt}
        />
      )}

      {/* Color palette */}
      <View style={styles.section}>
        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Color Palette — tap to copy
        </ThemedText>
        <View style={styles.swatchRow}>
          {board.colorPalette.map((swatch, i) => (
            <ColorSwatchItem key={i} hex={swatch.hex} name={swatch.name} />
          ))}
        </View>
      </View>

      {/* Thumbnail images */}
      {thumbImages.length > 0 && (
        <View style={styles.section}>
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Related Inspiration
          </ThemedText>
          <View style={styles.thumbRow}>
            {thumbImages.map((img, i) => (
              <Image
                key={i}
                source={{ uri: img.url }}
                alt={img.alt}
                style={styles.thumbImage}
                resizeMode="cover"
                accessibilityLabel={img.alt}
              />
            ))}
          </View>
        </View>
      )}

      {/* Save button */}
      <Pressable
        style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.8 }]}
        onPress={onSave}
        disabled={isSaving}
        accessibilityRole="button"
        accessibilityLabel="Save this concept board"
      >
        <ThemedText type="smallBold" style={styles.saveButtonText}>
          {isSaving ? 'Saving…' : 'Save Board'}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

/* ─── Styles ───────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
    paddingBottom: Spacing.five,
  },
  header: {
    gap: Spacing.one,
  },
  heading: {
    fontSize: 28,
    lineHeight: 36,
  },
  promptLabel: {
    color: Colors.light.textSecondary,
    fontStyle: 'italic',
  },
  heroImage: {
    width: '100%',
    height: 220,
    borderRadius: Spacing.three,
    backgroundColor: Colors.light.backgroundElement,
  },
  section: {
    gap: Spacing.two,
  },
  sectionTitle: {
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1,
  },
  swatchRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  swatch: {
    flex: 1,
    height: 72,
    borderRadius: Spacing.two,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  swatchText: {
    fontSize: 11,
    color: '#ffffff',
  },
  swatchTextDark: {
    color: '#000000',
  },
  swatchName: {
    fontSize: 10,
    color: '#ffffff',
    textAlign: 'center',
  },
  thumbRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  thumbImage: {
    flex: 1,
    height: 100,
    borderRadius: Spacing.two,
    backgroundColor: Colors.light.backgroundElement,
  },
  saveButton: {
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
  },
});
