import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { styles as g, colors } from '@/styles/shared';
import { api } from '@/lib/api';

export default function VerifyEmailScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [sending, setSending] = useState(false);

  return (
    <View style={g.screen}>
      <View style={g.cardContainer}>
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(19,146,236,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <MaterialIcons name="mark-email-read" size={48} color="#1392ec" />
          </View>
          <Text style={[g.title, { marginBottom: 8 }]}>Verifique o seu e-mail</Text>
          <Text style={[g.noticeText, { textAlign: 'center', marginBottom: 16 }]}>
            Sua conta foi criada com sucesso e precisa ser confirmada para que você possa entrar.
            Enviámos um link de confirmação para o endereço de e-mail associado à sua conta{email ? ` (${email})` : ''}. Não se esqueça de verificar a sua pasta de spam.
            Caso não receba em alguns minutos, toque em "Reenviar e-mail" abaixo.
          </Text>
        </View>

        <TouchableOpacity
          style={[g.primaryButton, { backgroundColor: '#1392ec', marginBottom: 10 }]}
          onPress={async () => {
            if (!email) return Alert.alert('Atenção', 'E-mail não informado.');
            try {
              setSending(true);
              await api.sendVerification(String(email));
              Alert.alert('Enviado', 'E-mail de verificação reenviado.');
            } catch (e: any) {
              Alert.alert('Erro', e?.message || 'Não foi possível reenviar.');
            } finally {
              setSending(false);
            }
          }}
          disabled={!email || sending}
        >
          <Text style={g.primaryButtonText}>{sending ? 'Enviando...' : 'Reenviar e-mail'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[g.primaryButton, { backgroundColor: '#1392ec' }]} onPress={() => router.replace('/login')}>
          <Text style={g.primaryButtonText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
