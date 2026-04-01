import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSubmit(trimmed);
  };

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Describe your vision… e.g. coastal cottage with morning light"
        placeholderTextColor={Colors.light.textSecondary}
        value={value}
        onChangeText={setValue}
        onSubmitEditing={handleSubmit}
        returnKeyType="go"
        autoCapitalize="sentences"
        autoCorrect
        maxLength={300}
        editable={!isLoading}
        accessible
        accessibilityLabel="Prompt input"
        accessibilityHint="Enter a text description to generate a concept board"
      />
      <Pressable
        style={({ pressed }) => [
          styles.button,
          (!value.trim() || isLoading) && styles.buttonDisabled,
          pressed && value.trim() && !isLoading && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!value.trim() || isLoading}
        accessibilityRole="button"
        accessibilityLabel="Generate concept board"
        accessibilityState={{ disabled: !value.trim() || isLoading }}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <ThemedText type="smallBold" style={styles.buttonText}>
            Generate
          </ThemedText>
        )}
      </Pressable>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Spacing.four,
    padding: Spacing.two,
    gap: Spacing.two,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.two,
    minHeight: 48,
  },
  button: {
    backgroundColor: '#208AEF',
    borderRadius: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 90,
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#ffffff',
  },
});
