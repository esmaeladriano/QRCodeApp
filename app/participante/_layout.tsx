import { Stack } from 'expo-router';
import React from 'react';

export default function ParticipanteLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="editar" />
    </Stack>
  );
}
