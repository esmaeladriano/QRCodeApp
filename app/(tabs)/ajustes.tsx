import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AjustesScreen() {
  return (
    <View style={s.container}>
      <Text style={s.title}>Ajustes</Text>
      <Text style={s.subtitle}>Configure preferências da sua conta e do aplicativo.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f7fa', padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#64748b' },
});
