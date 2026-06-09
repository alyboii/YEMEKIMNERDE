// ─────────────────────────────────────────────
// Kayıt Olma Ekranı — POST /auth/register
// ─────────────────────────────────────────────

import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const RegisterScreen = ({ navigation }) => {
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);

  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [sifre, setSifre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();

  const onRegister = async () => {
    if (!ad || !soyad || !email || !sifre) {
      Alert.alert('Uyarı', 'Ad, Soyad, E-posta ve Şifre alanları zorunludur.');
      return;
    }
    if (sifre.length < 8) {
      Alert.alert('Uyarı', 'Şifre en az 8 karakter olmalıdır.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({
        ad: ad.trim(),
        soyad: soyad.trim(),
        email: email.toLowerCase().trim(),
        sifre,
        telefon: telefon.trim() || undefined,
      });

      setIsSubmitting(false);

      if (result.success) {
        Alert.alert('Başarılı! 🎉', 'Hesabınız oluşturuldu ve otomatik giriş yapıldı.', [
          { text: 'Tamam', onPress: () => navigation.replace('Profile') }
        ]);
      } else {
        Alert.alert('Kayıt Başarısız', result.error || 'Bir hata oluştu.');
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı.');
    }
  };

  return (
    <View style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      <KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={s.card}>

            {/* Header */}
            <View style={s.header}>
              <Text style={s.title}>Hesap Oluştur</Text>
              <Text style={s.subtitle}>Bize katıl ve sipariş vermeye başla</Text>
            </View>

            {/* Form */}
            <View style={s.form}>
              <View style={s.row}>
                <TextInput
                  style={[s.input, s.halfInput]}
                  value={ad}
                  onChangeText={setAd}
                  placeholder="Ad"
                  placeholderTextColor="#A0A0A0"
                  returnKeyType="next"
                  onSubmitEditing={() => lastNameRef.current?.focus()}
                />
                <TextInput
                  ref={lastNameRef}
                  style={[s.input, s.halfInput]}
                  value={soyad}
                  onChangeText={setSoyad}
                  placeholder="Soyad"
                  placeholderTextColor="#A0A0A0"
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>

              <TextInput
                ref={emailRef}
                style={[s.input, { marginTop: 16 }]}
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => phoneRef.current?.focus()}
              />

              <TextInput
                ref={phoneRef}
                style={[s.input, { marginTop: 16 }]}
                value={telefon}
                onChangeText={setTelefon}
                placeholder="Telefon (opsiyonel)"
                placeholderTextColor="#A0A0A0"
                keyboardType="phone-pad"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />

              <TextInput
                ref={passwordRef}
                style={[s.input, { marginTop: 16 }]}
                value={sifre}
                onChangeText={setSifre}
                placeholder="Şifre (min 8 karakter)"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={onRegister}
              />

              <TouchableOpacity
                style={[s.registerBtn, isSubmitting && { opacity: 0.6 }]}
                onPress={onRegister}
                disabled={isSubmitting}
                activeOpacity={0.9}
              >
                <Text style={s.registerBtnText}>
                  {isSubmitting ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={s.footer}>
              <Text style={s.footerText}>Zaten hesabın var mı? </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={s.loginText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212' },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 400, backgroundColor: 'rgba(18,18,18,0.6)', padding: 32, borderRadius: 24, borderWidth: 1, borderColor: '#2C2C2C' },
  header: { alignItems: 'center', marginBottom: 32 },
  title: { color: '#FFFFFF', fontSize: 36, fontWeight: '800', letterSpacing: -0.8, marginBottom: 8 },
  subtitle: { color: '#A0A0A0', fontSize: 16, fontWeight: '400' },
  form: { width: '100%' },
  row: { flexDirection: 'row', gap: 12 },
  input: { backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#2C2C2C', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 16, color: '#FFFFFF', fontSize: 16 },
  halfInput: { flex: 1 },
  registerBtn: { backgroundColor: '#00e676', paddingVertical: 16, borderRadius: 999, alignItems: 'center', marginTop: 24, shadowColor: '#00e676', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 8 },
  registerBtnText: { color: '#00210b', fontSize: 14, fontWeight: '700', letterSpacing: 0.7 },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  footerText: { color: '#A0A0A0', fontSize: 14 },
  loginText: { color: '#00e676', fontSize: 14, fontWeight: '700', marginLeft: 4 },
});

export default RegisterScreen;
