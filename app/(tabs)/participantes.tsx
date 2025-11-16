import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ParticipantesScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'Todos' | 'Confirmado' | 'Não Confirmado' | 'Fez Check-in'>('Todos');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  const data = useMemo(
    () => [
      {
        id: '1',
        name: 'Eleanor Vance',
        secondary: 'eleanor.v@example.com',
        status: 'Fez Check-in' as const,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-f-F5Q9Wlkr-GmTO6lc20RFi3cGxtzMuHcyIrR128Qcz8gU8s55nV3vGNJq2Bsn3uv3C2349PSSalPAO2kINVW5R35xxLnX9bLiMHRDeNT17T1AvwdM9hx9nDBd2ZMckR8F6oObs-jH_rkEqZAMuZpM7EypHCtsgYfoO9H7W84itQvdkSnTteRx5azZxHqxW8DUMXiG4p5AD9ow7955EkHQUmABNLGqSiT7V6Il3pDdRG7hRoGWWGPB6UpnDS9QXIyR4IkR4GhnN',
      },
      {
        id: '2',
        name: 'Marcus Holloway',
        secondary: '+55 11 98765-4321',
        status: 'Confirmado' as const,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCmpBU8p3_qrhEWzPWHMdnfhfU2rpw-9AhiMiTDTFrvH9bRAen0YZRe5gKsrS-4e9d5pGH7WOR8SlVNAh33gEksPlCLjZW-CTRb_RVLldbU8Zsdz2ZqV_XvVueKBwOVkZSh_a_kChrjkS6oOjNY_2WWLy-EKH9if_qW0LV_WkGLZPTEycqetPCW4_tDkV005Uf5LyA41EOWVLD4w0eUzHFgKXKNhmy0zMdquvcCnkBdBe_3HZ8fZlu7tH4ljP1bZVqpAOgFdn76cOA4',
      },
      {
        id: '3',
        name: 'Anya Petrova',
        secondary: 'anya.p@example.com',
        status: 'Não Confirmado' as const,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCKjwd9LJ3qMR7K-t4oK6jCpxAdCxXWXeKGgM9-gk4K5x1chDb9EI3TVnrL_UYu8oJsoMPruGlgTwA-446Eoo-uIHzR5c9702PS9iBuDDqoSBZkVbWTEqRovuGyOjTS8cQAw-q3XFGhajdUlu2mv1_kHdNYkTBfdLOPdPrXngl9WE6g0Gmb_Y1uLUSlUU7difstc1ywyYAUbB7ZFRXckq4T1RjVU6EMtBbwu7kpqdVRdtaO97ifWWaUoW8Il6gKVAUWimGodhUfpKgI',
      },
      {
        id: '4',
        name: 'Kenji Tanaka',
        secondary: '+55 21 91234-5678',
        status: 'Fez Check-in' as const,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuANuXV4e58xylpAtVBoZtf-m4k_lSMJ14bX65gAyu6VTiQ8mTc-zRykscaxfwBkZ3xDcME9nTcR0EMtdIHaTiAAt_3J1pXwLBrf_w8_glqelX7izR36Y7JVBc2bGy8qOfAJ66FIItsXtNyevL2A0TyAJjVGgGY-VC-6J9kBK0StT4qi-Za00w3w544_oWCzq3jA_xPXmFs5JGPEuxEjLJ6WaYP7XpXYZCaDD7rJ-BAtB1LAB4GinzeHQZrgJgnPlMmMZSds2nwbC1vi',
      },
      {
        id: '5',
        name: 'Sofia Rossi',
        secondary: 'sofia.r@example.com',
        status: 'Confirmado' as const,
        avatar:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDT8l0H2U_xLEukfJQO_pqFeDvbuwHFRnr8s_nNOJYEg1aQ-wKE6_U0PdI6YGBneCdzUlqRU8mVIP7lVLAmoLsvM6z7kPg5SjCAkXS9_rymOKrRD0VTjd5_wEbOvd9ll5suw98AV3oqSiCRih6VRQTTnfDhEBlTWCovJFyYUJEXPI4hS_vHQcB4Ew1PlnHrchmxDKfWccrIUnioU2_7rMYSUJP2uxbE1zy01HRg8wlUIX07QtR37RBnGHDymaQcvTGzbqy1h7S497LK',
      },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return data.filter((p) => {
      const byQuery = !q || p.name.toLowerCase().includes(q) || p.secondary.toLowerCase().includes(q);
      const byFilter =
        filter === 'Todos' ||
        (filter === 'Confirmado' && p.status === 'Confirmado') ||
        (filter === 'Não Confirmado' && p.status === 'Não Confirmado') ||
        (filter === 'Fez Check-in' && p.status === 'Fez Check-in');
      return byQuery && byFilter;
    });
  }, [data, filter, query]);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Participantes</Text>
        <TouchableOpacity style={s.iconBtn}>
          <MaterialIcons name="download" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={s.iconBtn}>
          <MaterialIcons name="more-vert" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={s.controls}>
        <View style={s.searchWrap}>
          <MaterialIcons name="search" size={18} color={colors.textSecondary} style={s.searchIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por nome, e-mail ou telefone"
            placeholderTextColor={colors.textSecondary}
            style={s.searchInput}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filtersRow}>
          {(['Todos', 'Confirmado', 'Não Confirmado', 'Fez Check-in'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[s.chip, f === 'Todos' ? s.chipPrimary : s.chipDefault, filter === f && s.chipSelected]}
            >
              <Text style={[s.chipText, f === 'Todos' ? s.chipTextPrimary : s.chipTextDefault, filter === f && s.chipTextSelected]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={s.list} showsVerticalScrollIndicator={false}>
        {filtered.map((p) => (
          <View key={p.id} style={s.itemRow}>
            <Image source={{ uri: p.avatar }} style={s.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={s.name} numberOfLines={1}>
                {p.name}
              </Text>
              <Text style={s.secondary} numberOfLines={1}>
                {p.secondary}
              </Text>
            </View>
            <View style={[s.badge, getBadgeStyle(p.status).bg]}>
              <Text style={[s.badgeText, getBadgeStyle(p.status).text]}>{p.status}</Text>
            </View>
            <View style={s.actions}>
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() =>
                  router.push({
                    pathname: '/participante/editar',
                    params: { id: p.id, name: p.name, secondary: p.secondary, avatar: p.avatar },
                  })
                }
              >
                <MaterialIcons name="edit" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: 'transparent' }]}
                onPress={() => {
                  setToDelete({ id: p.id, name: p.name });
                  setConfirmVisible(true);
                }}
              > 
                <MaterialIcons name="delete" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={s.loadMoreWrap}>
          <TouchableOpacity style={s.loadMoreBtn}>
            <Text style={s.loadMoreText}>Carregar Mais</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={s.fab} onPress={() => router.push('/participante/editar')}>
        <MaterialIcons name="add" color="#fff" size={28} />
      </TouchableOpacity>

      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={s.modalBackdrop}>
          <View style={s.modalCard}>
            <View style={{ alignItems: 'center' }}>
              <View style={s.modalIconWrap}>
                <MaterialIcons name="delete" size={24} color={colors.danger} />
              </View>
              <Text style={s.modalTitle}>Excluir Participante</Text>
              <Text style={s.modalText}>
                Tem certeza que deseja excluir <Text style={{ fontWeight: '700', color: colors.textPrimary }}>{toDelete?.name}</Text>?
              </Text>
            </View>
            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalCancel} onPress={() => setConfirmVisible(false)}>
                <Text style={s.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.modalConfirm}
                onPress={() => {
                  // TODO: realizar exclusão real (API)
                  setConfirmVisible(false);
                  setToDelete(null);
                }}
              >
                <Text style={s.modalConfirmText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const colors = {
  primary: '#4A90E2',
  accent: '#F5A623',
  danger: '#D0021B',
  bg: '#f4f7fa',
  card: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  greenBg: '#dcfce7',
  greenText: '#166534',
  blueBg: '#dbeafe',
  blueText: '#1e3a8a',
  yellowBg: '#fef3c7',
  yellowText: '#92400e',
};

function getBadgeStyle(status: 'Fez Check-in' | 'Confirmado' | 'Não Confirmado') {
  switch (status) {
    case 'Fez Check-in':
      return { bg: { backgroundColor: colors.greenBg }, text: { color: colors.greenText } };
    case 'Confirmado':
      return { bg: { backgroundColor: colors.blueBg }, text: { color: colors.blueText } };
    case 'Não Confirmado':
    default:
      return { bg: { backgroundColor: colors.yellowBg }, text: { color: colors.yellowText } };
  }
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: 'rgba(244,247,250,0.9)',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  iconBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },

  controls: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  searchWrap: { position: 'relative', marginTop: 12, marginBottom: 10 },
  searchIcon: { position: 'absolute', left: 12, top: 12 },
  searchInput: {
    height: 44,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingLeft: 40,
    paddingRight: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  filtersRow: { paddingVertical: 4, columnGap: 8 },
  chip: { height: 36, paddingHorizontal: 16, borderRadius: 999, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  chipDefault: { backgroundColor: colors.card, borderColor: colors.border },
  chipPrimary: { backgroundColor: 'rgba(74,144,226,0.1)', borderColor: colors.primary },
  chipSelected: { borderColor: colors.primary, backgroundColor: 'rgba(74,144,226,0.15)' },
  chipText: { fontSize: 13, fontWeight: '600' },
  chipTextDefault: { color: colors.textPrimary },
  chipTextPrimary: { color: colors.primary },
  chipTextSelected: { color: colors.primary },

  list: { paddingBottom: 96 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    backgroundColor: '#fff',
  },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  secondary: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, marginRight: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  actions: { flexDirection: 'row', alignItems: 'center' },
  actionBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20 },

  loadMoreWrap: { paddingHorizontal: 16, paddingVertical: 16 },
  loadMoreBtn: { height: 44, borderRadius: 999, borderWidth: 1, borderColor: colors.primary, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(74,144,226,0.1)' },
  loadMoreText: { color: colors.primary, fontWeight: '700' },

  fab: { position: 'absolute', bottom: 24, right: 16, width: 56, height: 56, borderRadius: 16, backgroundColor: colors.accent, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 380, borderRadius: 16, backgroundColor: colors.card, padding: 16 },
  modalIconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(208,2,27,0.1)', justifyContent: 'center', alignItems: 'center' },
  modalTitle: { marginTop: 12, fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  modalText: { marginTop: 6, fontSize: 14, color: colors.textSecondary, textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  modalCancel: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  modalCancelText: { color: colors.textPrimary, fontWeight: '700' },
  modalConfirm: { flex: 1, height: 44, borderRadius: 10, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center' },
  modalConfirmText: { color: '#fff', fontWeight: '700' },
});
