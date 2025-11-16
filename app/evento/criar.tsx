import React, { useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, KeyboardAvoidingView, Image, FlatList } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '@/lib/storage';
import { api } from '@/lib/api';
import Constants from 'expo-constants';

export default function CriarEventoScreen() {
  const router = useRouter();

  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [locSuggestions, setLocSuggestions] = useState<Array<{ id: string; description: string }>>([]);
  const [locLoading, setLocLoading] = useState(false);
  const placesKey = (Constants.expoConfig as any)?.extra?.GOOGLE_MAPS_API_KEY || (Constants as any)?.manifest?.extra?.GOOGLE_MAPS_API_KEY || '';
  const isWeb = Platform.OS === 'web';
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const locDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function onLocationChange(text: string) {
    setLocation(text);
    if (!placesKey || text.trim().length < 3) {
      setLocSuggestions([]);
      return;
    }
    if (locDebounceRef.current) clearTimeout(locDebounceRef.current);
    locDebounceRef.current = setTimeout(async () => {
      try {
        setLocLoading(true);
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${placesKey}&types=geocode&language=pt-BR`;
        const res = await fetch(url);
        const json = await res.json();
        const items = (json?.predictions || []).map((p: any) => ({ id: p.place_id, description: p.description }));
        setLocSuggestions(items);
      } catch {
        // ignore
      } finally {
        setLocLoading(false);
      }
    }, 300);
  }

  const canSubmit = useMemo(() => {
    const v = validateAll(false);
    return v.isValid && !loading;
  }, [name, capacity, date, startTime, endTime, category, location, description, bannerUri, loading]);

  function validateAll(assign = true) {
    const e: { [k: string]: string | undefined } = {};
    if (!name || name.trim().length < 3) e.name = 'Informe um nome com pelo menos 3 caracteres';
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = 'Informe uma data válida (YYYY-MM-DD)';
    if (!startTime || !/^\d{2}:\d{2}$/.test(startTime)) e.startTime = 'Informe horário inicial (HH:mm)';
    if (!endTime || !/^\d{2}:\d{2}$/.test(endTime)) e.endTime = 'Informe horário final (HH:mm)';
    if (startTime && endTime) {
      const [sh, sm] = startTime.split(':').map(Number);
      const [eh, em] = endTime.split(':').map(Number);
      const start = sh * 60 + sm;
      const end = eh * 60 + em;
      if (end <= start) e.endTime = 'Horário final deve ser maior que o inicial';
    }
    const cap = Number(capacity);
    if (!capacity || !Number.isFinite(cap) || cap <= 0) e.capacity = 'Informe uma capacidade válida (> 0)';

    if (assign) setErrors(e);
    return { isValid: Object.keys(e).length === 0, errors: e };
  }

  async function pickBanner() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.8 });
    if (!res.canceled && res.assets?.length) {
      setBannerUri(res.assets[0].uri);
    }
  }

  function onDateChange(_: DateTimePickerEvent, value?: Date) {
    setShowDatePicker(false);
    if (value) {
      const y = value.getFullYear();
      const m = String(value.getMonth() + 1).padStart(2, '0');
      const d = String(value.getDate()).padStart(2, '0');
      setDate(`${y}-${m}-${d}`);
    }
  }
  function onTimeChange(setter: (v: string) => void, setShow: (b: boolean) => void) {
    return (_: DateTimePickerEvent, value?: Date) => {
      setShow(false);
      if (value) {
        const hh = String(value.getHours()).padStart(2, '0');
        const mm = String(value.getMinutes()).padStart(2, '0');
        setter(`${hh}:${mm}`);
      }
    };
  }

  async function submit() {
    const v = validateAll(true);
    if (!v.isValid) return;
    try {
      setLoading(true);
      const token = await storage.getToken();
      let uploadedUrl: string | undefined = undefined;
      if (bannerUri) {
        setUploadProgress(0);
        const res = await api.upload.banner(bannerUri, token || '', (p) => setUploadProgress(p));
        uploadedUrl = res?.url;
        setUploadProgress(100);
      }
      const payload: any = {
        name: name.trim(),
        category: category.trim() || undefined,
        location: location.trim() || undefined,
        date,
        startTime,
        endTime,
        capacity: Number(capacity),
        description: description.trim() || undefined,
        bannerUrl: uploadedUrl || undefined,
      };
      const created = await api.events.create(payload, token || '');
      if (created?.id) {
        router.replace({ pathname: '/evento/[id]', params: { id: String(created.id) } });
      } else {
        router.back();
      }
    } catch (err: any) {
      setErrors((prev) => ({ ...prev, submit: err?.message || 'Falha ao criar evento' }));
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  }

  return (
    <View style={s.screen}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerIcon} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Create New Event</Text>
        <View style={s.headerIcon} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.select({ ios: 'padding', android: undefined })}>
        <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
          {/* Upload banner */}
          <View style={s.bannerUpload}>
            {bannerUri ? (
              <Image source={{ uri: bannerUri }} style={s.bannerPreview} />
            ) : (
              <View style={{ alignItems: 'center', gap: 8 }}>
                <MaterialIcons name="add-photo-alternate" size={36} color={colors.textMuted} />
                <Text style={s.bannerTitle}>Upload Event Banner</Text>
                <Text style={s.bannerHint}>Tap to select an image from your gallery.</Text>
              </View>
            )}
            <TouchableOpacity style={s.uploadBtn} onPress={pickBanner}>
              <Text style={s.uploadBtnText}>{bannerUri ? 'Trocar Imagem' : 'Upload Image'}</Text>
            </TouchableOpacity>
            {uploadProgress !== null ? (
              <View style={s.progressBarWrap}>
                <View style={[s.progressBarFill, { width: `${uploadProgress}%` }]} />
                <Text style={s.progressText}>{uploadProgress}%</Text>
              </View>
            ) : null}
          </View>

          {/* Fields */}
          <View style={s.field}>
            <Text style={s.label}>Event Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter the name of your event"
              placeholderTextColor={colors.textPlaceholder}
              style={s.input}
            />
            {errors.name ? (
              <View style={s.errorBox}>
                <MaterialIcons name="error" size={16} color="#ef4444" />
                <Text style={s.errorText}>{errors.name}</Text>
              </View>
            ) : null}
          </View>

          <View style={s.field}>
            <View style={s.rowBetween}>
              <Text style={s.label}>Event Category</Text>
              <TouchableOpacity style={s.manageLink}>
                <MaterialIcons name="settings" size={14} color={colors.primary} />
                <Text style={s.manageLinkText}>Manage</Text>
              </TouchableOpacity>
            </View>
            <View style={s.selectWrap}>
              <TextInput
                value={category}
                onChangeText={setCategory}
                placeholder="Select a category"
                placeholderTextColor={colors.textPlaceholder}
                style={s.select}
              />
              <MaterialIcons name="unfold-more" size={20} color={colors.textMuted} style={s.selectIcon} />
            </View>
          </View>

          <View style={s.field}>
            <Text style={s.label}>Location</Text>
            <View style={s.iconInputWrap}>
              <TextInput
                value={location}
                onChangeText={onLocationChange}
                placeholder="Enter event location or address"
                placeholderTextColor={colors.textPlaceholder}
                style={[s.input, { paddingRight: 36 }]}
              />
              <MaterialIcons name="location-on" size={20} color={colors.textMuted} style={s.iconRight} />
            </View>
            {locLoading ? <Text style={s.suggestionHint}>Carregando sugestões...</Text> : null}
            {locSuggestions.length > 0 ? (
              <View style={s.suggestionsBox}>
                {locSuggestions.map((sug) => (
                  <TouchableOpacity key={sug.id} style={s.suggestionItem} onPress={() => { setLocation(sug.description); setLocSuggestions([]); }}>
                    <MaterialIcons name="place" size={16} color={colors.textMuted} />
                    <Text style={s.suggestionText} numberOfLines={1}>{sug.description}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Date</Text>
            {isWeb ? (
              <View style={s.iconInputWrap}>
                <TextInput
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textPlaceholder}
                  style={[s.input, { paddingRight: 36 }]}
                />
                <MaterialIcons name="calendar-month" size={20} color={colors.textMuted} style={s.iconRight} />
              </View>
            ) : (
              <TouchableOpacity activeOpacity={0.8} onPress={() => setShowDatePicker(true)}>
                <View style={s.iconInputWrap}>
                  <TextInput
                    value={date}
                    editable={false}
                    placeholder="Select date (YYYY-MM-DD)"
                    placeholderTextColor={colors.textPlaceholder}
                    style={[s.input, { paddingRight: 36 }]}
                  />
                  <MaterialIcons name="calendar-month" size={20} color={colors.textMuted} style={s.iconRight} />
                </View>
              </TouchableOpacity>
            )}
            {errors.date ? (
              <View style={s.errorBox}>
                <MaterialIcons name="error" size={16} color="#ef4444" />
                <Text style={s.errorText}>{errors.date}</Text>
              </View>
            ) : null}
            {showDatePicker && !isWeb && (
              <DateTimePicker mode="date" value={new Date()} onChange={onDateChange} />
            )}
          </View>

          <View style={s.grid2}>
            <View style={s.field}>
              <Text style={s.label}>Start Time</Text>
              {isWeb ? (
                <View style={s.iconInputWrap}>
                  <TextInput
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="HH:mm"
                    placeholderTextColor={colors.textPlaceholder}
                    style={[s.input, { paddingRight: 36 }]}
                  />
                  <MaterialIcons name="schedule" size={20} color={colors.textMuted} style={s.iconRight} />
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowStartPicker(true)}>
                  <View style={s.iconInputWrap}>
                    <TextInput
                      value={startTime}
                      editable={false}
                      placeholder="Select time (HH:mm)"
                      placeholderTextColor={colors.textPlaceholder}
                      style={[s.input, { paddingRight: 36 }]}
                    />
                    <MaterialIcons name="schedule" size={20} color={colors.textMuted} style={s.iconRight} />
                  </View>
                </TouchableOpacity>
              )}
              {errors.startTime ? (
                <View style={s.errorBox}>
                  <MaterialIcons name="error" size={16} color="#ef4444" />
                  <Text style={s.errorText}>{errors.startTime}</Text>
                </View>
              ) : null}
              {showStartPicker && !isWeb && (
                <DateTimePicker mode="time" value={new Date()} onChange={onTimeChange(setStartTime, setShowStartPicker)} />
              )}
            </View>
            <View style={s.field}>
              <Text style={s.label}>End Time</Text>
              {isWeb ? (
                <View style={s.iconInputWrap}>
                  <TextInput
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholder="HH:mm"
                    placeholderTextColor={colors.textPlaceholder}
                    style={[s.input, { paddingRight: 36 }]}
                  />
                  <MaterialIcons name="schedule" size={20} color={colors.textMuted} style={s.iconRight} />
                </View>
              ) : (
                <TouchableOpacity activeOpacity={0.8} onPress={() => setShowEndPicker(true)}>
                  <View style={s.iconInputWrap}>
                    <TextInput
                      value={endTime}
                      editable={false}
                      placeholder="Select time (HH:mm)"
                      placeholderTextColor={colors.textPlaceholder}
                      style={[s.input, { paddingRight: 36 }]}
                    />
                    <MaterialIcons name="schedule" size={20} color={colors.textMuted} style={s.iconRight} />
                  </View>
                </TouchableOpacity>
              )}
              {errors.endTime ? (
                <View style={s.errorBox}>
                  <MaterialIcons name="error" size={16} color="#ef4444" />
                  <Text style={s.errorText}>{errors.endTime}</Text>
                </View>
              ) : null}
              {showEndPicker && !isWeb && (
                <DateTimePicker mode="time" value={new Date()} onChange={onTimeChange(setEndTime, setShowEndPicker)} />
              )}
            </View>
          </View>

          <View style={s.field}>
            <View style={s.rowBetween}>
              <Text style={s.label}>Total capacity (max. participants)</Text>
              <Text style={s.required}>Required</Text>
            </View>
            <View style={s.iconInputLeftWrap}>
              <MaterialIcons name="groups" size={20} color={colors.textMuted} style={s.iconLeft} />
              <TextInput
                value={capacity}
                onChangeText={setCapacity}
                keyboardType="number-pad"
                placeholder="e.g., 100"
                placeholderTextColor={colors.textPlaceholder}
                style={[s.input, { paddingLeft: 36 }]}
              />
            </View>
            {errors.capacity ? (
              <View style={s.errorBox}>
                <MaterialIcons name="error" size={16} color="#ef4444" />
                <Text style={s.errorText}>{errors.capacity}</Text>
              </View>
            ) : null}
          </View>

          <View style={s.field}>
            <Text style={s.label}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us more about your event..."
              placeholderTextColor={colors.textPlaceholder}
              style={s.textarea}
              multiline
            />
          </View>

          <View style={{ height: 96 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer */}
      <View style={s.footer}>
        {errors.submit ? (
          <View style={[s.errorBox, { marginBottom: 8 }]}> 
            <MaterialIcons name="error" size={16} color="#ef4444" />
            <Text style={s.errorText}>{errors.submit}</Text>
          </View>
        ) : null}
        <TouchableOpacity style={[s.submitBtn, (!canSubmit || uploadProgress !== null) && s.submitBtnDisabled]} disabled={!canSubmit || uploadProgress !== null} onPress={submit}>
          <Text style={[s.submitText, !canSubmit && s.submitTextDisabled]}>{loading ? 'Criando...' : 'Create Event'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const colors = {
  primary: '#1392ec',
  bg: '#f6f7f8',
  card: '#ffffff',
  border: '#e5e7eb',
  text: '#0f172a',
  textMuted: '#6b7280',
  textPlaceholder: '#9ca3af',
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(246,247,248,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 18, fontWeight: '700', color: '#0b0f19' },

  content: { padding: 16 },
  bannerUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    alignItems: 'center',
    gap: 16,
  },
  bannerTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  bannerHint: { fontSize: 13, color: colors.textMuted },
  uploadBtn: { height: 40, paddingHorizontal: 20, borderRadius: 10, backgroundColor: 'rgba(19,146,236,0.1)', justifyContent: 'center', alignItems: 'center' },
  uploadBtnText: { color: colors.primary, fontWeight: '700' },
  bannerPreview: { width: '100%', height: 160, borderRadius: 12, backgroundColor: colors.card },
  progressBarWrap: { marginTop: 8, height: 8, borderRadius: 999, backgroundColor: '#e5e7eb', overflow: 'hidden', position: 'relative' },
  progressBarFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: colors.primary },
  progressText: { marginTop: 4, alignSelf: 'flex-end', fontSize: 12, color: colors.textMuted },

  field: { marginTop: 20 },
  label: { marginBottom: 8, fontSize: 14, fontWeight: '600', color: '#374151' },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  textarea: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
  },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  manageLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  manageLinkText: { color: colors.primary, fontSize: 13, fontWeight: '600' },

  selectWrap: { position: 'relative' },
  select: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text,
  },
  selectIcon: { position: 'absolute', right: 10, top: 14 },

  iconInputWrap: { position: 'relative' },
  iconRight: { position: 'absolute', right: 10, top: 14 },

  iconInputLeftWrap: { position: 'relative' },
  iconLeft: { position: 'absolute', left: 10, top: 14 },

  suggestionHint: { marginTop: 6, fontSize: 12, color: colors.textMuted },
  suggestionsBox: { marginTop: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.card, overflow: 'hidden' },
  suggestionItem: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  suggestionText: { flex: 1, fontSize: 14, color: colors.text },

  grid2: { flexDirection: 'row', gap: 12 },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: 'rgba(246,247,248,0.9)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  submitBtn: { height: 48, borderRadius: 10, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' },
  submitBtnDisabled: { backgroundColor: '#d1d5db' },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  submitTextDisabled: { color: '#6b7280' },
  required: { color: '#ef4444', fontSize: 12, fontWeight: '600' },
  errorBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 8, padding: 10, borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.1)' },
  errorText: { flex: 1, fontSize: 13, color: '#ef4444' },
});
