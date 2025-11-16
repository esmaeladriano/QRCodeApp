import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function EditarParticipanteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string; secondary?: string; avatar?: string }>();

  const initial = useMemo(
    () => ({
      name: params.name ?? '',
      phone: params.secondary?.startsWith('+') ? params.secondary : '',
      email: params.secondary && params.secondary.includes('@') ? params.secondary : '',
      notes: '',
      avatar:
        params.avatar ||
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-f-F5Q9Wlkr-GmTO6lc20RFi3cGxtzMuHcyIrR128Qcz8gU8s55nV3vGNJq2Bsn3uv3C2349PSSalPAO2kINVW5R35xxLnX9bLiMHRDeNT17T1AvwdM9hx9nDBd2ZMckR8F6oObs-jH_rkEqZAMuZpM7EypHCtsgYfoO9H7W84itQvdkSnTteRx5azZxHqxW8DUMXiG4p5AD9ow7955EkHQUmABNLGqSiT7V6Il3pDdRG7hRoGWWGPB6UpnDS9QXIyR4IkR4GhnN',
    }),
    [params]
  );

  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState(initial.phone);
  const [email, setEmail] = useState(initial.email);
  const [notes, setNotes] = useState(initial.notes);

  return (
    <View style={s.screen}>
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios-new" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Editar Participante</Text>
        <View style={s.headerBtn} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          <View style={s.avatarWrap}>
            <View style={s.avatarHolder}>
              <Image source={{ uri: initial.avatar }} style={s.avatar} />
              <TouchableOpacity style={s.avatarEdit}>
                <MaterialIcons name="edit" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Nome completo</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Nome" placeholderTextColor={colors.textSecondary} style={s.input} />
          </View>

          <View style={s.field}>
            <Text style={s.label}>Número de telefone</Text>
            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+55 21 99999-9999"
              placeholderTextColor={colors.textSecondary}
              style={s.input}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>
              Email <Text style={s.labelOptional}>(opcional)</Text>
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="email@exemplo.com"
              placeholderTextColor={colors.textSecondary}
              style={s.input}
            />
          </View>

          <View style={s.field}>
            <Text style={s.label}>
              Observações <Text style={s.labelOptional}>(opcional)</Text>
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              placeholder="Observações do participante"
              placeholderTextColor={colors.textSecondary}
              style={s.textarea}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={s.footer}>
        <TouchableOpacity style={s.btnCancel} onPress={() => router.back()}>
          <Text style={s.btnCancelText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={s.btnSave}
          onPress={() => {
            // TODO: integrar com API para salvar
            router.back();
          }}
        >
          <Text style={s.btnSaveText}>Salvar Alterações</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const colors = {
  primary: '#4A90E2',
  bg: '#f4f7fa',
  card: '#ffffff',
  border: '#e5e7eb',
  textPrimary: '#111827',
  textSecondary: '#6b7280',
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: { flexDirection: 'row', alignItems: 'center', height: 56, paddingHorizontal: 16, backgroundColor: 'rgba(244,247,250,0.9)' },
  headerBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: colors.textPrimary },

  content: { padding: 16, paddingBottom: 96 },
  avatarWrap: { alignItems: 'center', marginBottom: 16 },
  avatarHolder: { width: 96, height: 96, borderRadius: 48, position: 'relative' },
  avatar: { width: '100%', height: '100%', borderRadius: 48 },
  avatarEdit: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },

  field: { marginBottom: 14 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  labelOptional: { color: colors.textSecondary, fontWeight: '400' },
  input: {
    height: 48,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.textPrimary,
    fontSize: 14,
  },
  textarea: {
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.textPrimary,
    fontSize: 14,
  },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: 'rgba(244,247,250,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btnCancel: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card },
  btnCancelText: { color: colors.textPrimary, fontWeight: '700' },
  btnSave: { flex: 2, height: 48, borderRadius: 24, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  btnSaveText: { color: '#fff', fontWeight: '700' },
});
