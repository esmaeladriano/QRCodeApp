import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { storage } from '@/lib/storage';
import { api } from '@/lib/api';
import { styles as g } from '@/styles/shared';

export default function DashboardScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const token = await storage.getToken();
      if (!token) {
        router.replace('/login');
        return;
      }
      try {
        const { user } = await api.me(token);
        setUserName(user?.name || '');
      } catch {
        router.replace('/login');
      }
    })();
  }, [router]);
  return (
    <View style={s.screen}>
      <View style={g.cardContainer}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtOLDMW34_l2ZMogqWeTdjCwH3QJ440AN81naR3-t6V2429feHKHlGvjFstiAq1t8O6nLMLrnLRiCuKsKJxHMiLIRW4Ud89QQZMQ9vu7zcoFw69itLyfS4awcNABEOLgFeIlrYHfXwWivnwLpH5JDITYvRAZZbc9rF_1joWCsXlwYamAc6Fe5hOBHOAKaTM5zUBhDEpQKYw1F6zZPWuTBcYaOlPsDUM6Nw-qtA2rI6W2US6W0PvcKk_MrLGQG3j0WUQ7wcz68jxS8e' }}
            style={s.avatar}
          />
          <View>
            <Text style={s.subtext}>Bem-vindo(a) de volta,</Text>
            <Text style={s.title}>{userName || '—'}</Text>
          </View>
        </View>
        <TouchableOpacity style={s.iconBtn}>
          <MaterialIcons name="notifications" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Resumo */}
        <View style={{ marginBottom: 12 }}>
          <Text style={s.sectionTitle}>Resumo dos Seus Eventos</Text>
        </View>
        <View style={s.grid2}>
          <Card icon="event" value="12" label="Meus Eventos" />
          <Card icon="group" value="1,450" label="Participantes" />
          <Card icon="how_to_reg" value="987" label="Check-ins" />
          <Card icon="paid" value="$5.2k" label="Receita" />
        </View>

        {/* Gráfico simples */}
        <View style={s.card}>
          <View style={s.rowBetween}>
            <View>
              <Text style={s.cardTitle}>Inscrições na Semana</Text>
              <Text style={s.cardSubtitle}>Últimos 7 dias (seus eventos)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.bigNumber}>350</Text>
              <View style={s.rowCenter}>
                <MaterialIcons name="arrow-upward" size={14} color="#0bda5b" />
                <Text style={s.success}>+15%</Text>
              </View>
            </View>
          </View>
          <View style={s.barRow}>
            {[0.6,0.5,0.9,0.6,1,0.9,0.4].map((h, i) => (
              <View key={i} style={[s.bar, { height: 96 * h, backgroundColor: i===4 ? '#1392ec' : 'rgba(19,146,236,0.35)'}]} />
            ))}
          </View>
          <View style={s.weekRow}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <Text key={d} style={[s.weekLabel, i===4 && { color: '#1392ec', fontWeight: '700' }]}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Próximos eventos */}
        <View style={s.rowBetween}>
          <Text style={s.sectionTitle}>Seus Próximos Eventos</Text>
          <TouchableOpacity>
            <Text style={s.link}>Ver todos</Text>
          </TouchableOpacity>
        </View>
        <EventItem
          title="Tech Conference 2024"
          subtitle="Começa em 2 dias"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuCx4ivqaIP3kq1BgLa_ppKQKH0PYYdy5akHNK4idtSKP3h5TrLs5xLo6mH_b7kIh2rohzhFwg0hIq5zsoL76f1AbF_YsIt4yosc-GTAycOyoEYyeVWTDPoCWvAUmav6ftEd6vHTwssODoH58mOUdYPpG2HdYfBjF9w_qPqWczgE9jWnVwiWQ3Rqf0359hq0kv7Lce4wCuv88XFJgkrblktOYBPHKuVc5Nsvi8--tDk6gsmP_uo-s_HlOr0b-h73SnbhHzKc2S7rZpib"
        />
        <EventItem
          title="Local Music Fest"
          subtitle="Começa em 1 semana"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuDQMWNxD1EjCTTaQ_hjmPgoMdF_qLOPt6emOJm2UA4iZ-fvfKx4_wPmDa1AJxmEcYR1J3ON2racOjUYrN_m76yUpxynX-edSY1fshTEDgnosktOesot7DbwKRRp7TX195h5d5yKQHSGTm1XzEGa6mZcxyZvxwBEr7IiBofOkRvIsG8VySh5hPCv9NZ57JhGCx0542mxgvoCsMEUEz4a9J3pJsiVsNWXSRSANaPzzX8lgLqIZTQZapaNiobTZWJ-4Uy5v2Bk4MqagsTp"
        />
        <EventItem
          title="Startup Pitch Night"
          subtitle="Começa em 28 de Out"
          image="https://lh3.googleusercontent.com/aida-public/AB6AXuC3MhPGsZoZKt40YtmByDGc4R5Br6LqoyrCA4tD_cZouKwX7Ld8X-5iLGcHKkdg66y55uF7QfrhqaZE5GR_0-dHv71ki4LPlVWWW41b8ZN6JyOmtgnbcDb8gsWUpxUSq_Wy6q983Xp3QIsvzkqF0y3Impa0HLc6jn-QIgN4g15koQyLJ7Q2QqaL7ePxjruycySQ9ia_1Krz3ugodBwOqftEPSr8BduLlYKlN2K-tiCqRMyFbS2A28OIIXaEbrFL77zYFJm5rNX9ABzr"
        />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
    </View>
  );
}

function Card({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={s.cardSmall}>
      <View style={s.cardIconBg}>
        <MaterialIcons name={icon} size={20} color="#1392ec" />
      </View>
      <Text style={s.cardValue}>{value}</Text>
      <Text style={s.cardLabel}>{label}</Text>
    </View>
  );
}

function EventItem({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <TouchableOpacity style={s.eventItem}>
      <Image source={{ uri: image }} style={s.eventThumb} />
      <View style={{ flex: 1 }}>
        <Text style={s.eventTitle} numberOfLines={1}>{title}</Text>
        <Text style={s.eventSubtitle} numberOfLines={2}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f7fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, backgroundColor: 'rgba(244,247,250,0.9)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  subtext: { color: '#64748b', fontSize: 12 },
  title: { fontSize: 18, fontWeight: '700' },
  iconBtn: { padding: 12, borderRadius: 12, backgroundColor: 'rgba(244,247,250,0.9)' },
  content: { padding: 16, paddingTop: 0 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  grid2: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  cardSmall: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flex: 1, marginRight: 8 },
  cardIconBg: { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(19,146,236,0.1)', justifyContent: 'center', alignItems: 'center' },
  cardValue: { fontSize: 18, fontWeight: '700', marginBottom: 2 },
  cardLabel: { fontSize: 12, color: '#64748b' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  cardSubtitle: { fontSize: 12, color: '#64748b' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bigNumber: { fontSize: 24, fontWeight: '700' },
  success: { fontSize: 12, color: '#0bda5b' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  barRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  bar: { width: 24, borderRadius: 12, backgroundColor: 'rgba(19,146,236,0.35)' },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekLabel: { fontSize: 12, color: '#64748b' },
  eventItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 8 },
  eventThumb: { width: 80, height: 80, borderRadius: 12, marginRight: 12 },
  eventTitle: { fontSize: 16, fontWeight: '700' },
  eventSubtitle: { fontSize: 12, color: '#64748b' },
  fab: { position: 'absolute', bottom: 16, right: 16, backgroundColor: '#1392ec', borderRadius: 28, padding: 12, justifyContent: 'center', alignItems: 'center' },
  link: { fontSize: 14, color: '#1392ec' },
});