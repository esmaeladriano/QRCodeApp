import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import type { Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { styles as g } from '@/styles/shared';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);

  const emailInvalid = showErrors && !/^\S+@\S+\.[\w-]+$/.test(email);
  const passwordInvalid = showErrors && password.length === 0;
  const hasGlobalError = emailInvalid || passwordInvalid;

  const onSubmit = () => {
    const valid = /^\S+@\S+\.[\w-]+$/.test(email) && password.length > 0;
    if (!valid) {
      setShowErrors(true);
      return;
    }
    // Simular sucesso de login
    router.replace('/(tabs)');
  };

  return (
    <View style={g.screen}>
      <View style={g.cardContainer}>
        <View style={g.headerIconWrapper}>
          <MaterialIcons name="event" size={28} color="#4F46E5" />
        </View>
        <Text style={g.title}>Bem-vindo de volta!</Text>
        <Text style={g.subtitle}>Faça login para gerenciar seus eventos.</Text>

        {hasGlobalError && (
          <View style={g.errorBanner}>
            <MaterialIcons name="error" size={18} color="#EF4444" style={{ marginRight: 8 }} />
            <Text style={g.errorBannerText}>
              Credenciais inválidas. Por favor, verifique seu e-mail e palavra-passe.
            </Text>
          </View>
        )}

        <View style={g.field}>
          <Text style={g.label}>Endereço de E-mail</Text>
          <View style={[g.inputContainer, emailInvalid && g.errorBorder]}>
            <MaterialIcons name="mail" size={20} color={emailInvalid ? '#EF4444' : '#9CA3AF'} style={g.inputIcon} />
            <TextInput
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={g.input}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          {emailInvalid && <Text style={g.errorText}>Por favor, insira um formato de e-mail válido.</Text>}
        </View>

        <View style={g.field}>
          <Text style={g.label}>Palavra-passe</Text>
          <View style={[g.inputContainer, passwordInvalid && g.errorBorder]}>
            <MaterialIcons name="lock" size={20} color={passwordInvalid ? '#EF4444' : '#9CA3AF'} style={g.inputIcon} />
            <TextInput
              placeholder="Digite sua palavra-passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={[g.input, { paddingRight: 44 }]}
              placeholderTextColor="#9CA3AF"
            />
            <View style={g.trailingIcon}>
              <MaterialIcons name="visibility" size={22} color="#9CA3AF" />
            </View>
          </View>
          {passwordInvalid && <Text style={g.errorText}>Este campo é obrigatório.</Text>}
        </View>

        <View style={{ alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => Alert.alert('Recuperar senha', 'Funcionalidade a implementar')}>
            <Text style={g.link}>Esqueceu a palavra-passe?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={g.primaryButton} onPress={onSubmit}>
          <Text style={g.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={g.dividerRow}>
          <View style={g.divider} />
          <Text style={g.dividerText}>OU</Text>
          <View style={g.divider} />
        </View>

        <TouchableOpacity style={g.socialButton} onPress={() => Alert.alert('Google', 'Login com Google')}>
          <View style={{ width: 20, marginRight: 12 }}>
            {/* Placeholder simple G icon shape */}
            <Text style={{ fontWeight: '700', color: '#EA4335' }}>G</Text>
          </View>
          <Text style={g.socialButtonText}>Entrar com Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[g.socialButton, { backgroundColor: '#1877F2' }]} onPress={() => Alert.alert('Facebook', 'Login com Facebook')}>
          <View style={{ width: 20, marginRight: 12 }}>
            <Text style={{ fontWeight: '700', color: 'white' }}>f</Text>
          </View>
          <Text style={[g.socialButtonText, { color: 'white' }]}>Entrar com Facebook</Text>
        </TouchableOpacity>

        <View style={g.noticeRow}>
          <MaterialIcons name="open-in-new" size={14} color="#6B7280" style={{ marginRight: 6 }} />
          <Text style={g.noticeText}>Ao usar o login social, você será redirecionado para autorizar o acesso de forma segura.</Text>
        </View>

        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={g.footerText}>
            Não tem uma conta? <Link href={{ pathname: '/register' } as unknown as Href} style={g.footerLink}>Cadastre-se</Link>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = g;
