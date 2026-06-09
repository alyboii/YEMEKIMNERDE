// ─────────────────────────────────────────────
// Giriş Yap Ekranı — Stitch Design (Uber Style)
// Gerçek API bağlantılı (AuthContext üzerinden)
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
  Dimensions,
  Alert,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// ─── Sabit Float Emojiler ───
const EMOJIS = ['🍕', '🍔', '🍣', '🍦', '🍟', '🍩', '🌮', '🥗', '🍜', '🍰'];
const floatingEmojis = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
  left: `${Math.random() * 90}%`,
  top: `${Math.random() * 90}%`,
  fontSize: Math.floor(Math.random() * 24) + 24,
  opacity: Math.random() * 0.05 + 0.1,
  transform: [{ rotate: `${Math.random() * 40 - 20}deg` }]
}));

const LoginScreen = ({ navigation }) => {
  const passwordRef = useRef(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();

  const onLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'E-posta ve şifre alanlarını doldurun.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Admin girişi — gerçek API'ye giriş yapıp TOKEN al, sonra panele geç
      //    (Token olmadan restoran ekleme/silme gibi işlemler 401 verir)
      if (email.toLowerCase().trim() === 'admin@mail.com') {
        const adminResult = await login({
          email: 'admin@mail.com',
          sifre: password,
        });
        setIsSubmitting(false);
        if (adminResult.success) {
          navigation.replace('AdminDashboard');
        } else {
          Alert.alert('Admin Girişi Başarısız', adminResult.error || 'Şifre hatalı.');
        }
        return;
      }

      // 2. AuthContext üzerinden gerçek API'ye giriş
      const result = await login({
        email: email.toLowerCase().trim(),
        sifre: password,
      });

      setIsSubmitting(false);

      if (result.success) {
        // 3. Başarılı giriş — Ana sayfaya (restoran listesi) yönlendir
        navigation.replace('Home');
      } else {
        // 4. API'den dönen hata mesajını göster
        Alert.alert('Giriş Başarısız', result.error || 'E-posta veya şifre hatalı.');
      }
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert('Bağlantı Hatası', 'Sunucuya bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />

      {/* ─── Animated Emoji Background ─── */}
      <View style={styles.emojiContainer}>
        {floatingEmojis.map((item) => (
          <Text
            key={item.id}
            style={[
              styles.emoji,
              {
                left: item.left,
                top: item.top,
                fontSize: item.fontSize,
                opacity: item.opacity,
                transform: item.transform,
              }
            ]}
          >
            {item.emoji}
          </Text>
        ))}
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card */}
          <View style={styles.card}>
            {/* Header Section */}
            <View style={styles.header}>
              <Text style={styles.title}>Tekrar Hoşgeldin</Text>
              <Text style={styles.subtitle}>Devam etmek için giriş yap</Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="E-posta"
                placeholderTextColor="#A0A0A0"
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
              />
              
              <TextInput
                ref={passwordRef}
                style={[styles.input, { marginTop: 16 }]}
                value={password}
                onChangeText={setPassword}
                placeholder="Şifre"
                placeholderTextColor="#A0A0A0"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={onLogin}
              />

              <View style={styles.forgotContainer}>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={styles.forgotText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={styles.loginBtn}
                onPress={onLogin}
                disabled={isSubmitting}
                activeOpacity={0.7}
              >
                <Text style={styles.loginBtnText}>
                  {isSubmitting ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer Section */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Hesabın yok mu? </Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('Register')}>
                <Text style={styles.signupText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121212',
  },
  flex: {
    flex: 1,
  },
  emojiContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    zIndex: 0,
  },
  emoji: {
    position: 'absolute',
    color: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(18, 18, 18, 0.6)',
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    color: '#E2E2E2',
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginBottom: 8,
  },
  subtitle: {
    color: '#A0A0A0',
    fontSize: 18,
    fontWeight: '400',
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#E2E2E2',
    fontSize: 16,
  },
  forgotContainer: {
    alignItems: 'flex-end',
    marginTop: 16,
    marginBottom: 8,
  },
  forgotText: {
    color: '#A0A0A0',
    fontSize: 12,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: '#00e676',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  loginBtnText: {
    color: '#00210b',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.7,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  signupText: {
    color: '#00e676',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
});

export default LoginScreen;
