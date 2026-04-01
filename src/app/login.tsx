import React from 'react';

import { ThemedView } from '@/components/themed-view';
import { LoginForm } from '@/components/login-form';

export default function LoginScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <LoginForm />
    </ThemedView>
  );
}
