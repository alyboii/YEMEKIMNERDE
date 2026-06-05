// ─────────────────────────────────────────────
// Giriş Yap Ekranı
// POST /v1/auth/login
// Form: Email, Şifre
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
import { loginValidationRules } from '../../utils/validators';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();

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
      email: '',
      sifre: '',
    },
    loginValidationRules
  );

  // ─── Input Ref'leri ───
  const sifreRef = useRef(null);

  // ─── Giriş İşlemi ───
  const onLogin = async () => {
    await handleSubmit(async (formValues) => {
      const result = await login(formValues);

      if (result.success) {
        showToast('Giriş başarılı! Hoş geldiniz 👋', 'success');
      } else {
        showToast(result.error || 'Giriş başarısız oldu', 'error');
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
            <Text style={styles.appName}>YEMEKİMNEREDE</Text>
            <Text style={styles.title}>Tekrar Hoş Geldin!</Text>
            <Text style={styles.subtitle}>
              Hesabına giriş yap ve siparişine devam et.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
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
              onSubmitEditing={() => sifreRef.current?.focus()}
            />

            {/* Şifre */}
            <Input
              label="Şifre"
              value={values.sifre}
              onChangeText={(v) => handleChange('sifre', v)}
              onBlur={() => handleBlur('sifre')}
              error={getError('sifre')}
              placeholder="Şifrenizi girin"
              iconName="🔒"
              secureTextEntry
              returnKeyType="done"
              inputRef={sifreRef}
              onSubmitEditing={onLogin}
            />

            {/* Giriş Yap Butonu */}
            <View style={styles.buttonContainer}>
              <Button
                title="Giriş Yap"
                onPress={onLogin}
                loading={isSubmitting || isLoading}
                iconLeft="🔑"
              />
            </View>
          </View>

          {/* Dekoratif Ayraç */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Alt Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Hesabın yok mu? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.footerLink}>Kayıt Ol</Text>
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
    justifyContent: 'center',
    padding: SPACING.screenPadding,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    fontSize: 56,
    marginBottom: SPACING.sm,
  },
  appName: {
    ...TYPOGRAPHY.overline,
    color: COLORS.primary,
    letterSpacing: 3,
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
  },
  form: {
    marginTop: SPACING.sm,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textTertiary,
    marginHorizontal: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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

export default LoginScreen;
