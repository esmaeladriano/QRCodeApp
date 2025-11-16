import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { styles as g } from '@/styles/shared';

function isEmail(v: string) {
  return /\S+@\S+\.[\w-]+/.test(v);
}

function hasDigit(v: string) {
  return /\d/.test(v);
}

function passwordStrength(pw: string) {
  // Very simple strength estimator: 0-3 blocks
  let score = 0;
  if (pw.length >= 6) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d|[^\w]/.test(pw)) score++;
  return Math.min(score, 3);
}

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const emailValid = isEmail(email);
  const phoneValid = phone.trim().length >= 9; // destaque visual apenas
  const nameInvalid = showErrors && (fullName.trim().length === 0 || hasDigit(fullName));
  const emailInvalid = showErrors && !emailValid;
  const confirmInvalid = showErrors && confirm !== password;
  const pwScore = useMemo(() => passwordStrength(password), [password]);

  // Regras mínimas: sem exigir telefone; senha >= 4; confirmação igual
  const requiredValid = fullName.trim().length > 0 && !hasDigit(fullName) && emailValid && password.length >= 4 && confirm === password;
  const hasGlobalError = showErrors && !requiredValid;

  const onSubmit = () => {
    const valid = requiredValid;
    if (!valid) {
      setShowErrors(true);
      return;
    }
    Alert.alert('Conta criada', 'Sua conta foi criada com sucesso!', [
      { text: 'OK', onPress: () => router.replace('/login') },
    ]);
  };

  return (
    <View style={g.screen}>
       <View style={g.cardContainer}> 
      <View style={g.headerIconWrapperTop}>
        <View style={g.headerIcon}>
          <MaterialIcons name="event" size={28} color="#fff" />
        </View>
      </View>

      <Text style={g.title}>Crie Sua Conta de Organizador</Text>
      <Text style={g.subtitle}>Junte-se à nossa plataforma e comece a gerir os seus eventos.</Text>

      {hasGlobalError && (
        <View style={g.errorBanner}>
          <MaterialIcons name="error" size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={g.errorBannerText}>Por favor, verifique os campos destacados.</Text>
        </View>
      )}

      <View style={{ height: 16 }} />

      {/* Nome completo */}
      <View style={g.field}>
        <View style={[g.inputContainer, nameInvalid && g.errorBorder]}>
          <MaterialIcons name="person" size={20} color={nameInvalid ? '#EF4444' : '#9CA3AF'} style={g.inputIcon} />
          <TextInput
            placeholder="Nome Completo"
            value={fullName}
            onChangeText={setFullName}
            style={g.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {nameInvalid && <Text style={g.errorText}>O nome não pode conter números.</Text>}
      </View>

      {/* Email */}
      <View style={g.field}>
        <View style={[g.inputContainer, emailInvalid ? g.errorBorder : (emailValid && g.successBorder)]}>
          <MaterialIcons name="mail" size={20} color={emailInvalid ? '#EF4444' : (emailValid ? '#10B981' : '#9CA3AF')} style={g.inputIcon} />
          <TextInput
            placeholder="Email de Trabalho"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={g.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {emailValid && (
          <Text style={g.successText}>Um e-mail de confirmação será enviado para este endereço.</Text>
        )}
      </View>

      {/* Telefone (opcional) */}
      <View style={g.field}>
        <View style={[g.inputContainer, phoneValid && g.successBorder]}>
          <MaterialIcons name="phone" size={20} color={phoneValid ? '#10B981' : '#9CA3AF'} style={g.inputIcon} />
          <TextInput
            placeholder="+244 9xx xxx xxx"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={[g.input, { paddingRight: 36 }]}
            placeholderTextColor="#9CA3AF"
          />
          {phoneValid && (
            <View style={g.trailingIcon}>
              <MaterialIcons name="check-circle" size={20} color="#10B981" />
            </View>
          )}
        </View>
      </View>

      {/* Password */}
      <View style={g.field}>
        <View style={[g.inputContainer, showErrors && password.length < 4 && g.errorBorder]}>
          <MaterialIcons name="lock" size={20} color="#9CA3AF" style={g.inputIcon} />
          <TextInput
            placeholder="Criar Palavra-passe"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPw}
            style={[g.input, { paddingRight: 36 }]}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={g.trailingIcon} onPress={() => setShowPw(s => !s)}>
            <MaterialIcons name={showPw ? 'visibility' : 'visibility-off'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 8 }}>
          <View style={g.strengthRow}>
            <Text style={[g.strengthLabel, { color: '#10B981' }]}>{pwScore >= 2 ? 'Senha segura' : 'Fortaleça sua senha'}</Text>
          </View>
          <View style={g.strengthBarBg}>
            <View style={[g.strengthChunk, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: pwScore >= 1 ? '#10B981' : '#E5E7EB' }]} />
            <View style={[g.strengthChunk, { backgroundColor: pwScore >= 2 ? '#10B981' : '#E5E7EB' }]} />
            <View style={[g.strengthChunk, { borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: pwScore >= 3 ? '#10B981' : '#E5E7EB' }]} />
          </View>
        </View>
      </View>

      {/* Confirm Password (obrigatório) */}
      <View style={g.field}>
        <View style={[g.inputContainer, confirmInvalid && g.errorBorder]}>
          <MaterialIcons name="lock" size={20} color={confirmInvalid ? '#EF4444' : '#9CA3AF'} style={g.inputIcon} />
          <TextInput
            placeholder="Confirmar Palavra-passe"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry={!showConfirm}
            style={[g.input, { paddingRight: 36 }]}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={g.trailingIcon} onPress={() => setShowConfirm(s => !s)}>
            <MaterialIcons name={showConfirm ? 'visibility' : 'visibility-off'} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={[g.primaryButton, showErrors && !requiredValid && { opacity: 0.8 }]} onPress={onSubmit}>
        <Text style={g.primaryButtonText}>Criar Conta</Text>
      </TouchableOpacity>

      <View style={{ alignItems: 'center', paddingVertical: 16 }}>
        <Text style={g.footerText}>
          Já tem uma conta?{' '}
          <Text style={g.footerLink} onPress={() => router.replace('/login')}>Entrar</Text>
        </Text>
      </View>
    </View>
    </View>
  );
}
const styles = g;
