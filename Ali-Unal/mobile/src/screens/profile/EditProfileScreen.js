import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.ad || '');
  const [lastName, setLastName] = useState(user?.soyad || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.telefon || '');
  const [isSaving, setIsSaving] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const getLabelStyle = (inputName) => [
    styles.label,
    focusedInput === inputName && styles.labelFocused,
  ];

  const getInputStyle = (inputName) => [
    styles.input,
    focusedInput === inputName && styles.inputFocused,
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        ad: fullName,
        soyad: lastName,
        telefon: phone || undefined,
      });

      setIsSaving(false);

      if (result.success) {
        Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
          { text: 'Tamam', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Hata', result.error || 'Profil güncellenemedi.');
      }
    } catch (error) {
      setIsSaving(false);
      Alert.alert('Hata', 'Sunucuya bağlanılamadı.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROFİLİ DÜZENLE</Text>
        <View style={styles.headerBtnSpacer} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* ─── Avatar Section ─── */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.ad ? user.ad.charAt(0).toUpperCase() : '?'}
                </Text>
              </View>
            </View>
          </View>

          {/* ─── Form Section ─── */}
          <View style={styles.formSection}>
            
            <View style={styles.inputGroup}>
              <Text style={getLabelStyle('fullName')}>AD</Text>
              <TextInput 
                style={getInputStyle('fullName')}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={getLabelStyle('lastName')}>SOYAD</Text>
              <TextInput 
                style={getInputStyle('lastName')}
                value={lastName}
                onChangeText={setLastName}
                onFocus={() => setFocusedInput('lastName')}
                onBlur={() => setFocusedInput(null)}
                placeholderTextColor="#A0A0A0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={getLabelStyle('email')}>E-POSTA ADRESİ</Text>
              <TextInput 
                style={[getInputStyle('email'), styles.inputDisabled]}
                value={email}
                editable={false}
                placeholderTextColor="#A0A0A0"
              />
              <Text style={styles.helperText}>E-posta adresi değiştirilemez</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={getLabelStyle('phone')}>TELEFON NUMARASI</Text>
              <TextInput 
                style={getInputStyle('phone')}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => setFocusedInput('phone')}
                onBlur={() => setFocusedInput(null)}
                keyboardType="phone-pad"
                placeholderTextColor="#A0A0A0"
                placeholder="+905551234567"
              />
            </View>

          </View>


          
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ─── Bottom Button ─── */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]} 
          activeOpacity={0.9} 
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveBtnText}>
            {isSaving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
          </Text>
          {!isSaving && <Text style={styles.checkIcon}>✓</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerBtn: { padding: 8, width: 48, alignItems: 'flex-start' },
  headerBtnSpacer: { width: 48 },
  headerIcon: { color: '#e2e2e2', fontSize: 24 },
  headerTitle: { color: '#A0A0A0', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  
  scrollContent: { padding: 20, paddingBottom: 120 },
  
  avatarSection: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { width: 128, height: 128, borderRadius: 64, borderWidth: 2, borderColor: '#2C2C2C', backgroundColor: '#2a2a2a', marginBottom: 16 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 64, backgroundColor: '#00E676', alignItems: 'center', justifyContent: 'center' },
  avatarInitial: { color: '#000000', fontSize: 48, fontWeight: '800' },
  
  formSection: { marginBottom: 32 },
  inputGroup: { marginBottom: 24 },
  label: { color: '#bacbb9', fontSize: 14, fontWeight: '700', marginLeft: 4, marginBottom: 8, letterSpacing: 1 },
  labelFocused: { color: '#00E676' },
  input: { backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#2C2C2C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 16, color: '#e2e2e2', fontSize: 16 },
  inputFocused: { borderColor: '#00E676' },
  inputDisabled: { opacity: 0.5 },
  helperText: { color: '#A0A0A0', fontSize: 11, marginTop: 6, marginLeft: 4 },

  securityHint: { flexDirection: 'row', backgroundColor: '#1b1b1b', borderWidth: 1, borderColor: '#2C2C2C', borderRadius: 12, padding: 16, alignItems: 'flex-start' },
  shieldIcon: { fontSize: 20, marginRight: 12, marginTop: 2 },
  hintTextContainer: { flex: 1 },
  hintTitle: { color: '#e2e2e2', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  hintDesc: { color: '#bacbb9', fontSize: 14, lineHeight: 20 },

  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'rgba(0,0,0,0.8)' },
  saveBtn: { backgroundColor: '#00E676', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 20, borderRadius: 999 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { color: '#000000', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
  checkIcon: { color: '#000000', fontSize: 18, fontWeight: '900', marginLeft: 8 },
});

export default EditProfileScreen;
