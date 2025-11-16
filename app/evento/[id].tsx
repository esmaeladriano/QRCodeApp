import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from '@/lib/api';
import { storage } from '@/lib/storage';

export default function EventoDetalhesScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [event, setEvent] = useState<{
    id: string;
    name: string;
    category?: string;
    location?: string;
    date: string;
    startTime: string;
    endTime: string;
    capacity: number;
    description?: string;
    bannerUrl?: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await storage.getToken();
        const data = await api.events.get(String(id), token || '');
        setEvent(data);
      } catch (e: any) {
        setError(e?.message || 'Falha ao carregar evento');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Detalhes do Evento</Text>
        <View style={s.headerBtn} />
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {loading ? (
          <ActivityIndicator />
        ) : error ? (
          <View style={s.errorBox}>
            <MaterialIcons name="error" size={18} color="#ef4444" />
            <Text style={s.errorText}>{error}</Text>
          </View>
        ) : event ? (
          <View style={{ gap: 12 }}>
            {event.bannerUrl ? <Image source={{ uri: event.bannerUrl }} style={s.banner} /> : null}
            <Text style={s.title}>{event.name}</Text>
            <Text style={s.meta}>Data: {event.date} • {event.startTime} - {event.endTime}</Text>
            {event.location ? <Text style={s.meta}>Local: {event.location}</Text> : null}
            <Text style={s.meta}>Capacidade: {event.capacity}</Text>
            {event.description ? <Text style={s.desc}>{event.description}</Text> : null}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const colors = {
  bg: '#f6f7f8',
  text: '#0f172a',
  textMuted: '#6b7280',
  card: '#ffffff',
  border: '#e5e7eb',
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { height: 56, paddingHorizontal: 16, backgroundColor: 'rgba(246,247,248,0.9)', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.text },
  content: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textMuted },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)' },
  errorText: { color: '#ef4444' },
  banner: { width: '100%', height: 160, borderRadius: 12, marginBottom: 4, backgroundColor: colors.card },
  meta: { fontSize: 14, color: colors.textMuted },
  desc: { fontSize: 14, color: colors.text },
});
