import { Stack } from 'expo-router';
import React from 'react';

export default function EventoLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="criar" />
    </Stack>
  );
}
