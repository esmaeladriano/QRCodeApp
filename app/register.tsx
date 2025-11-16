import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { styles as g } from '@/styles/shared';
import { api } from '@/lib/api';
import { storage } from '@/lib/storage';

function isEmail(v: string) {
  return /\S+@\S+\.[\w-]+/.test(v);
}

function formatAngolaPhone(input: string) {
  const digits = input.replace(/\D/g, '');
  // Remover 244 do início se usuário digitar
  let d = digits.startsWith('244') ? digits.slice(3) : digits;
  // Limitar a 9 + 8 dígitos
  d = d.slice(0, 9);
  let out = '+244 ';
  if (d.length > 0) {
    out += d.slice(0, 1);
  }
  if (d.length > 1) {
    out += d.slice(1, 3).padEnd(Math.min(2, Math.max(0, d.length - 1)), '');
  }
  if (d.length > 3) {
    out += ' ' + d.slice(3, 6).padEnd(Math.min(3, Math.max(0, d.length - 3)), '');
  }
  if (d.length > 6) {
    out += ' ' + d.slice(6, 9);
  }
  return out.trimEnd();
}

function hasDigit(v: string) {
  return /\d/.test(v);
}

function passwordStrength(pw: string) {
  // Strength estimator aligned with new rules
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
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
  const [loading, setLoading] = useState(false);
  const [sendingVerify, setSendingVerify] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const phoneRegex = /^\+244\s9\d{2}\s\d{3}\s\d{3}$/;

  const emailValid = isEmail(email);
  const phoneValid = phoneRegex.test(phone.trim());
  const nameInvalid = showErrors && (fullName.trim().length === 0 || hasDigit(fullName));
  const emailInvalid = (showErrors && !emailValid) || emailTaken;
  const confirmInvalid = showErrors && confirm !== password;
  const pwScore = useMemo(() => passwordStrength(password), [password]);
  const passwordMeets = password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);

  // Regras mínimas: telefone obrigatório; senha >= 8 com maiúscula, minúscula e número; confirmação igual
  const requiredValid = fullName.trim().length > 0 && !hasDigit(fullName) && emailValid && phoneValid && passwordMeets && confirm === password;
  const hasGlobalError = showErrors && !requiredValid;

  const onSubmit = async () => {
    const valid = requiredValid;
    if (!valid) {
      setShowErrors(true);
      return;
    }
    try {
      setLoading(true);
      setServerError(null);
      const { token } = await api.register({
        name: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
      });
      await storage.setToken(token);
      Alert.alert('Sucesso', 'Conta criada com sucesso! Você já está autenticado.', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (e: any) {
      setShowErrors(true);
      if (e?.status === 409 || e?.body?.error === 'email_in_use') {
        setEmailTaken(true);
        Alert.alert('E-mail já cadastrado', 'Este e-mail já está em uso. Tente entrar ou usar outro e-mail.');
      } else {
        const msg = e?.message || e?.body?.error || 'Tente novamente mais tarde.';
        setServerError(typeof msg === 'string' ? msg : 'Erro inesperado.');
        Alert.alert('Erro ao criar conta', typeof msg === 'string' ? msg : 'Erro inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={g.screen}>
       <View style={g.cardContainer}> 
      <View style={g.headerIconWrapperTop}>
        <View style={g.headerIcon}>
          <MaterialIcons name="event" size={28} color="#fff" />
        </View>

      {serverError && (
        <View style={g.errorBanner}>
          <MaterialIcons name="error" size={18} color="#EF4444" style={{ marginRight: 8 }} />
          <Text style={g.errorBannerText}>{serverError}</Text>
        </View>
      )}
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
            onChangeText={(v) => { setEmail(v); setEmailTaken(false); }}
            keyboardType="email-address"
            autoCapitalize="none"
            style={g.input}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        {emailTaken ? (
          <Text style={g.errorText}>Este e-mail já está em uso. Tente entrar ou usar outro e-mail.</Text>
        ) : (
          emailValid && (
            <Text style={g.successText}>Um e-mail de confirmação será enviado para este endereço.</Text>
          )
        )}
        <View style={{ alignItems: 'flex-end', marginTop: 6 }}>
          <TouchableOpacity
            onPress={async () => {
              if (!emailValid) return Alert.alert('Atenção', 'Informe um e-mail válido.');
              try {
                setSendingVerify(true);
                await api.sendVerification(email.trim());
                Alert.alert('Enviado', 'E-mail de verificação reenviado.');
              } catch (e: any) {
                Alert.alert('Erro', e?.message || 'Não foi possível reenviar.');
              } finally {
                setSendingVerify(false);
              }
            }}
            disabled={!emailValid || sendingVerify}
          >
            <Text style={g.link}>{sendingVerify ? 'Enviando...' : 'Reenviar e-mail'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Telefone (obrigatório, formato +244 9xx xxx xxx) */}
      <View style={g.field}>
        <View style={[g.inputContainer, (!phoneValid && showErrors) ? g.errorBorder : (phoneValid && g.successBorder)]}>
          <MaterialIcons name="phone" size={20} color={!phoneValid && showErrors ? '#EF4444' : (phoneValid ? '#10B981' : '#9CA3AF')} style={g.inputIcon} />
          <TextInput
            placeholder="+244 9xx xxx xxx"
            value={phone}
            onChangeText={(v) => setPhone(formatAngolaPhone(v))}
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
        {(!phoneValid && showErrors) && (
          <Text style={g.errorText}>Informe um telefone válido no formato +244 9xx xxx xxx.</Text>
        )}
      </View>

      {/* Password */}
      <View style={g.field}>
        <View style={[g.inputContainer, showErrors && !passwordMeets && g.errorBorder]}>
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
          {!passwordMeets && showErrors ? (
            <Text style={g.errorText}>A senha deve ter no mínimo 8 caracteres e incluir maiúscula, minúscula e número.</Text>
          ) : (
            <>
              <View style={g.strengthRow}>
                <Text style={[g.strengthLabel, { color: '#10B981' }]}>{pwScore >= 2 ? 'Senha segura' : 'Fortaleça sua senha'}</Text>
              </View>
              <View style={g.strengthBarBg}>
                <View style={[g.strengthChunk, { borderTopLeftRadius: 8, borderBottomLeftRadius: 8, backgroundColor: pwScore >= 1 ? '#10B981' : '#E5E7EB' }]} />
                <View style={[g.strengthChunk, { backgroundColor: pwScore >= 2 ? '#10B981' : '#E5E7EB' }]} />
                <View style={[g.strengthChunk, { borderTopRightRadius: 8, borderBottomRightRadius: 8, backgroundColor: pwScore >= 3 ? '#10B981' : '#E5E7EB' }]} />
              </View>
            </>
          )}
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

      <TouchableOpacity style={[g.primaryButton, showErrors && !requiredValid && { opacity: 0.8 }]} onPress={onSubmit} disabled={loading}>
        <Text style={g.primaryButtonText}>{loading ? 'Criando...' : 'Criar Conta'}</Text>
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
