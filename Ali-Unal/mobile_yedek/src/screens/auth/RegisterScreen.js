// ─────────────────────────────────────────────
// Kayıt Ol Ekranı
// POST /v1/auth/register
// Form: Ad, Soyad, Email, Şifre, Telefon
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { showToast } from '../../components/common/Toast';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { registerValidationRules } from '../../utils/validators';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

const RegisterScreen = ({ navigation }) => {
  const { register, isLoading } = useAuth();

  // ─── Form State ───
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    getError,
    isSubmitting,
  } = useForm(
    {
      ad: '',
      soyad: '',
      email: '',
      sifre: '',
      telefon: '',
    },
    registerValidationRules
  );

  // ─── Input Ref'leri (next field focus) ───
  const soyadRef = useRef(null);
  const emailRef = useRef(null);
  const sifreRef = useRef(null);
  const telefonRef = useRef(null);

  // ─── Kayıt İşlemi ───
  const onRegister = async () => {
    await handleSubmit(async (formValues) => {
      const result = await register(formValues);

      if (result.success) {
        showToast('Hesabınız başarıyla oluşturuldu! 🎉', 'success');
      } else {
        showToast(result.error || 'Kayıt başarısız oldu', 'error');
      }
    });
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.logo}>🍽️</Text>
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>
              YEMEKİMNEREDE'ye hoş geldin! Hemen kayıt ol ve lezzetleri keşfet.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Ad - Soyad (yan yana) */}
            <View style={styles.row}>
              <View style={styles.halfField}>
                <Input
                  label="Ad"
                  value={values.ad}
                  onChangeText={(v) => handleChange('ad', v)}
                  onBlur={() => handleBlur('ad')}
                  error={getError('ad')}
                  placeholder="Adınız"
                  iconName="👤"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => soyadRef.current?.focus()}
                />
              </View>
              <View style={styles.rowSpacer} />
              <View style={styles.halfField}>
                <Input
                  label="Soyad"
                  value={values.soyad}
                  onChangeText={(v) => handleChange('soyad', v)}
                  onBlur={() => handleBlur('soyad')}
                  error={getError('soyad')}
                  placeholder="Soyadınız"
                  autoCapitalize="words"
                  returnKeyType="next"
                  inputRef={soyadRef}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
              </View>
            </View>

            {/* Email */}
            <Input
              label="E-posta"
              value={values.email}
              onChangeText={(v) => handleChange('email', v)}
              onBlur={() => handleBlur('email')}
              error={getError('email')}
              placeholder="ornek@email.com"
              iconName="📧"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              inputRef={emailRef}
              onSubmitEditing={() => sifreRef.current?.focus()}
            />

            {/* Şifre */}
            <Input
              label="Şifre"
              value={values.sifre}
              onChangeText={(v) => handleChange('sifre', v)}
              onBlur={() => handleBlur('sifre')}
              error={getError('sifre')}
              placeholder="En az 8 karakter"
              iconName="🔒"
              secureTextEntry
              returnKeyType="next"
              inputRef={sifreRef}
              onSubmitEditing={() => telefonRef.current?.focus()}
            />

            {/* Telefon */}
            <Input
              label="Telefon (Opsiyonel)"
              value={values.telefon}
              onChangeText={(v) => handleChange('telefon', v)}
              onBlur={() => handleBlur('telefon')}
              error={getError('telefon')}
              placeholder="+905551234567"
              iconName="📱"
              keyboardType="phone-pad"
              returnKeyType="done"
              inputRef={telefonRef}
            />

            {/* Kayıt Ol Butonu */}
            <View style={styles.buttonContainer}>
              <Button
                title="Kayıt Ol"
                onPress={onRegister}
                loading={isSubmitting || isLoading}
                iconLeft="🚀"
              />
            </View>
          </View>

          {/* Alt Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Zaten bir hesabın var mı? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Giriş Yap</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.screenPadding,
    paddingTop: SPACING.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logo: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.h1,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  form: {
    marginTop: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
  },
  halfField: {
    flex: 1,
  },
  rowSpacer: {
    width: SPACING.sm,
  },
  buttonContainer: {
    marginTop: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  footerText: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  footerLink: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
  },
});

export default RegisterScreen;
