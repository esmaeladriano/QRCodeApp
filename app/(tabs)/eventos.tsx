import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Status = 'Ativo' | 'Próximo' | 'Concluído' | 'Cancelado';

export default function EventosScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'Todos'>('Ativo');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const events = useMemo(
    () => [
      {
        id: '1',
        title: 'Conferência Anual de Tecnologia',
        date: '25 de Outubro de 2024',
        location: 'Centro de Convenções',
        status: 'Ativo' as Status,
      },
      {
        id: '2',
        title: 'Workshop de Marketing Digital',
        date: '15 de Novembro de 2024',
        location: 'Espaço Inovação',
        status: 'Próximo' as Status,
      },
      {
        id: '3',
        title: 'Festival de Música Local',
        date: '01 de Setembro de 2024',
        location: 'Parque da Cidade',
        status: 'Concluído' as Status,
      },
      {
        id: '4',
        title: 'Feira de Artesanato Regional',
        date: '10 de Dezembro de 2024',
        location: 'Praça Central',
        status: 'Cancelado' as Status,
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = events.filter((e) => {
      const byQuery = !q || e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q) || e.date.toLowerCase().includes(q);
      const byStatus = statusFilter === 'Todos' || e.status === statusFilter;
      return byQuery && byStatus;
    });
    // sort by date string YYYY-MM-DD
    return list.sort((a, b) => (sortOrder === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)));
  }, [events, query, statusFilter, sortOrder]);

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerLeft}>
          <Image
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-08A9l6_s9HWWTdtKOd247RCslmUkX_F7asgeMyvzVohbcNg-zFAnTno4eh_NGnqozASO27I6kb48AQM-IMl4Rr_BqGIPfm-p-3cLcpxa_c9L0WNFMgTXz14Z8mJ_ZogPLZMOIVCF_5Vc078xARwSaPkjgfjkKeDCNucabGQqrqjKsQSl56vuSBo82L2DwFqGTegd5xwxSGN4rjBBLPQ74Pa5iY7RKU0VpovxHHK71-pE4NDw8wODcRUAX6BFQKigbS3DlAYGJ1R9' }}
            style={s.avatar}
          />
        </View>
        <Text style={s.headerTitle}>Meus Eventos</Text>
        <TouchableOpacity style={s.headerBtn}>
          <MaterialIcons name="notifications" size={22} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchRow}>
        <View style={s.searchWrap}>
          <View style={s.searchIconBox}>
            <MaterialIcons name="search" size={20} color={colors.textMuted} />
          </View>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nome do evento..."
            placeholderTextColor={colors.textMuted}
            style={s.searchInput}
          />
        </View>
      </View>

      {/* Chips: filter/sort + status */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chipsRow}>
        <TouchableOpacity style={s.chipNeutral} onPress={() => setShowFilters(true)}>
          <MaterialIcons name="tune" size={18} color={colors.text} />
          <Text style={s.chipNeutralText}>Filtrar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.chipNeutral} onPress={() => setShowFilters(true)}>
          <MaterialIcons name="swap-vert" size={18} color={colors.text} />
          <Text style={s.chipNeutralText}>Ordenar</Text>
        </TouchableOpacity>
        {(['Ativo', 'Próximo', 'Concluído'] as Status[]).map((st) => {
          const selected = statusFilter === st;
          return (
            <TouchableOpacity key={st} style={[s.chipFilter, selected && s.chipFilterSelected]} onPress={() => setStatusFilter(st)}>
              <Text style={[s.chipFilterText, selected && s.chipFilterTextSelected]}>{st}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* List */}
      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={s.card}
            onPress={() => router.push({ pathname: '/evento/[id]/participantes', params: { id: e.id } })}
          >
            <View style={{ gap: 8 }}>
              <View style={s.cardTop}>
                <Text style={s.cardTitle}>{e.title}</Text>
                <View style={[s.badge, badgeStyle(e.status).bg]}> 
                  <Text style={[s.badgeText, badgeStyle(e.status).text]}>{e.status}</Text>
                </View>
              </View>
              <View style={{ gap: 6 }}>
                <View style={s.rowIconText}>
                  <MaterialIcons name="calendar-today" size={18} color={colors.textMuted} />
                  <Text style={s.rowText}>{e.date}</Text>
                </View>
                <View style={s.rowIconText}>
                  <MaterialIcons name="location-on" size={18} color={colors.textMuted} />
                  <Text style={s.rowText}>{e.location}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={s.fab}
        onPress={() => router.push({ pathname: '/evento/criar' })}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Filters/Sort Modal */}
      <Modal transparent visible={showFilters} animationType="fade" onRequestClose={() => setShowFilters(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <Text style={s.modalTitle}>Filtros e Ordenação</Text>
            <View style={{ height: 12 }} />
            <Text style={s.modalSection}>Ordenar por data</Text>
            <View style={s.modalRow}>
              <TouchableOpacity style={[s.modalChip, sortOrder === 'desc' && s.modalChipSelected]} onPress={() => setSortOrder('desc')}>
                <Text style={[s.modalChipText, sortOrder === 'desc' && s.modalChipTextSelected]}>Mais recente → antiga</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalChip, sortOrder === 'asc' && s.modalChipSelected]} onPress={() => setSortOrder('asc')}>
                <Text style={[s.modalChipText, sortOrder === 'asc' && s.modalChipTextSelected]}>Mais antiga → recente</Text>
              </TouchableOpacity>
            </View>
            <View style={{ height: 16 }} />
            <Text style={s.modalSection}>Status</Text>
            <View style={s.modalRowWrap}>
              {(['Todos', 'Ativo', 'Próximo', 'Concluído', 'Cancelado'] as const).map((st) => (
                <TouchableOpacity key={st} style={[s.modalChip, statusFilter === st && s.modalChipSelected]} onPress={() => setStatusFilter(st)}>
                  <Text style={[s.modalChipText, statusFilter === st && s.modalChipTextSelected]}>{st}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ height: 16 }} />
            <TouchableOpacity style={s.modalApply} onPress={() => setShowFilters(false)}>
              <Text style={s.modalApplyText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const colors = {
  primary: '#1392ec',
  bg: '#f6f7f8',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#6b7280',
  border: '#e5e7eb',
  greenBg: '#dcfce7',
  greenText: '#166534',
  amberBg: '#fef3c7',
  amberText: '#92400e',
  grayBg: '#e5e7eb',
  grayText: '#1f2937',
  redBg: '#fee2e2',
  redText: '#991b1b',
};

function badgeStyle(status: Status) {
  switch (status) {
    case 'Ativo':
      return { bg: { backgroundColor: colors.greenBg }, text: { color: colors.greenText } };
    case 'Próximo':
      return { bg: { backgroundColor: colors.amberBg }, text: { color: colors.amberText } };
    case 'Concluído':
      return { bg: { backgroundColor: colors.grayBg }, text: { color: colors.grayText } };
    case 'Cancelado':
    default:
      return { bg: { backgroundColor: colors.redBg }, text: { color: colors.redText } };
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingBottom: 8, backgroundColor: 'rgba(246,247,248,0.9)' },
  headerLeft: { width: 48, height: 48, justifyContent: 'center' },
  headerTitle: { flex: 1, textAlign: 'left', fontSize: 18, fontWeight: '700', color: '#0b0f19' },
  headerBtn: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18 },

  searchRow: { paddingHorizontal: 16, paddingTop: 4 },
  searchWrap: { flexDirection: 'row', alignItems: 'stretch' },
  searchIconBox: { height: 48, width: 48, borderTopLeftRadius: 12, borderBottomLeftRadius: 12, borderWidth: 1, borderRightWidth: 0, borderColor: colors.border, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center' },
  searchInput: { flex: 1, height: 48, borderTopRightRadius: 12, borderBottomRightRadius: 12, borderWidth: 1, borderLeftWidth: 0, borderColor: colors.border, backgroundColor: colors.card, paddingHorizontal: 12, color: colors.text, fontSize: 16 },

  chipsRow: { paddingHorizontal: 16, paddingVertical: 12, columnGap: 12 },
  chipNeutral: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 36, paddingHorizontal: 12, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.06)' },
  chipNeutralText: { color: colors.text, fontSize: 14, fontWeight: '500' },
  chipFilter: { height: 36, paddingHorizontal: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(19,146,236,0.12)' },
  chipFilterSelected: { backgroundColor: 'rgba(19,146,236,0.25)' },
  chipFilterText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
  chipFilterTextSelected: { color: colors.primary, fontWeight: '700' },

  list: { padding: 16, paddingTop: 8 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2, marginBottom: 12 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  rowIconText: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowText: { fontSize: 14, color: colors.textMuted },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 },
  badgeText: { fontSize: 12, fontWeight: '700' },

  fab: { position: 'absolute', bottom: 24, right: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 420, borderRadius: 14, backgroundColor: colors.card, padding: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.text },
  modalSection: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: 8 },
  modalRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  modalRowWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  modalChip: { height: 36, paddingHorizontal: 12, borderRadius: 999, backgroundColor: 'rgba(0,0,0,0.06)', justifyContent: 'center', alignItems: 'center' },
  modalChipSelected: { backgroundColor: 'rgba(19,146,236,0.2)' },
  modalChipText: { color: colors.text, fontWeight: '600' },
  modalChipTextSelected: { color: colors.primary },
  modalApply: { marginTop: 8, height: 44, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  modalApplyText: { color: '#fff', fontWeight: '700' },
});
