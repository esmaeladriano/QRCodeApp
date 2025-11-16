import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function DashboardScreen() {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtOLDMW34_l2ZMogqWeTdjCwH3QJ440AN81naR3-t6V2429feHKHlGvjFstiAq1t8O6nLMLrnLRiCuKsKJxHMiLIRW4Ud89QQZMQ9vu7zcoFw69itLyfS4awcNABEOLgFeIlrYHfXwWivnwLpH5JDITYvRAZZbc9rF_1joWCsXlwYamAc6Fe5hOBHOAKaTM5zUBhDEpQKYw1F6zZPWuTBcYaOlPsDUM6Nw-qtA2rI6W2US6W0PvcKk_MrLGQG3j0WUQ7wcz68jxS8e' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.subtext}>Bem-vindo(a) de volta,</Text>
            <Text style={styles.title}>Alex Martinez</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="notifications" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Resumo */}
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.sectionTitle}>Resumo dos Seus Eventos</Text>
        </View>
        <View style={styles.grid2}>
          <Card icon="event" value="12" label="Meus Eventos" />
          <Card icon="group" value="1,450" label="Participantes" />
          <Card icon="how_to_reg" value="987" label="Check-ins" />
          <Card icon="paid" value="$5.2k" label="Receita" />
        </View>

        {/* Gráfico simples */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.cardTitle}>Inscrições na Semana</Text>
              <Text style={styles.cardSubtitle}>Últimos 7 dias (seus eventos)</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.bigNumber}>350</Text>
              <View style={styles.rowCenter}>
                <MaterialIcons name="arrow-upward" size={14} color="#0bda5b" />
                <Text style={styles.success}>+15%</Text>
              </View>
            </View>
          </View>
          <View style={styles.barRow}>
            {[0.6,0.5,0.9,0.6,1,0.9,0.4].map((h, i) => (
              <View key={i} style={[styles.bar, { height: 96 * h, backgroundColor: i===4 ? '#1392ec' : 'rgba(19,146,236,0.35)'}]} />
            ))}
          </View>
          <View style={styles.weekRow}>
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <Text key={d} style={[styles.weekLabel, i===4 && { color: '#1392ec', fontWeight: '700' }]}>{d}</Text>
            ))}
          </View>
        </View>

        {/* Próximos eventos */}
        <View style={styles.rowBetween}>
          <Text style={styles.sectionTitle}>Seus Próximos Eventos</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Ver todos</Text>
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
      <TouchableOpacity style={styles.fab}>
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

function Card({ icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <View style={styles.cardSmall}>
      <View style={styles.cardIconBg}>
        <MaterialIcons name={icon} size={20} color="#1392ec" />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

function EventItem({ title, subtitle, image }: { title: string; subtitle: string; image: string }) {
  return (
    <TouchableOpacity style={styles.eventItem}>
      <Image source={{ uri: image }} style={styles.eventThumb} />
      <View style={{ flex: 1 }}>
        <Text style={styles.eventTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.eventSubtitle} numberOfLines={2}>{subtitle}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#94a3b8" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f7fa' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 12, backgroundColor: 'rgba(244,247,250,0.9)' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
  subtext: { color: '#64748b', fontSize: 12 },
  title: { color: '#0f172a', fontSize: 20, fontWeight: '700' },
  iconBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, paddingBottom: 96 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a' },
  grid2: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cardSmall: { flexBasis: '48%', backgroundColor: '#fff', borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  cardIconBg: { width: 40, height: 40, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e7f4fe', marginBottom: 8 },
  cardValue: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginTop: 4 },
  cardLabel: { fontSize: 12, color: '#64748b', marginTop: 2 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginTop: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  rowCenter: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  cardSubtitle: { fontSize: 12, color: '#64748b' },
  bigNumber: { fontSize: 22, fontWeight: '700', color: '#0f172a' },
  success: { fontSize: 12, color: '#0bda5b', fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 110, marginTop: 10, marginBottom: 6, paddingHorizontal: 4 },
  bar: { width: 18, borderRadius: 6 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
  weekLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8' },
  eventItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 10, borderRadius: 12, marginTop: 10, gap: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  eventThumb: { width: 64, height: 64, borderRadius: 10, backgroundColor: '#e2e8f0' },
  eventTitle: { fontSize: 14, fontWeight: '600', color: '#0f172a' },
  eventSubtitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  fab: { position: 'absolute', right: 16, bottom: 32, width: 56, height: 56, borderRadius: 28, backgroundColor: '#1392ec', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 },
});
