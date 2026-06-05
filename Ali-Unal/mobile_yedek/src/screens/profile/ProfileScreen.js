// ─────────────────────────────────────────────
// Profil Ekranı
// GET    /v1/users/{kullaniciId}    — Profil bilgilerini oku
// PUT    /v1/users/{kullaniciId}    — Profil güncelle
// PUT    /v1/users/{kullaniciId}/password — Şifre değiştir
// DELETE /v1/users/{kullaniciId}    — Hesap sil
// ─────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { ProfileSkeleton } from '../../components/common/SkeletonLoader';
import { showToast } from '../../components/common/Toast';
import useAuth from '../../hooks/useAuth';
import useForm from '../../hooks/useForm';
import { profileValidationRules, passwordValidationRules } from '../../utils/validators';
import { getUserInitials, formatDate } from '../../utils/helpers';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';
import { SHADOWS } from '../../theme/spacing';

const ProfileScreen = ({ navigation }) => {
  const {
    user,
    refreshProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    logout,
  } = useAuth();

  // ─── Local State ───
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ─── Profil Güncelleme Formu ───
  const profileForm = useForm(
    {
      ad: user?.ad || '',
      soyad: user?.soyad || '',
      telefon: user?.telefon || '',
    },
    profileValidationRules
  );

  // ─── Şifre Değiştirme Formu ───
  const passwordForm = useForm(
    {
      mevcutSifre: '',
      yeniSifre: '',
    },
    passwordValidationRules
  );

  // ─── Profil Yükle ───
  const loadProfile = useCallback(async () => {
    const result = await refreshProfile();
    setIsLoadingProfile(false);

    if (!result.success) {
      showToast(result.error || 'Profil yüklenemedi', 'error');
    }
  }, [refreshProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ─── Kullanıcı değiştiğinde formu güncelle ───
  useEffect(() => {
    if (user) {
      profileForm.resetForm({
        ad: user.ad || '',
        soyad: user.soyad || '',
        telefon: user.telefon || '',
      });
    }
  }, [user?._id, user?.ad, user?.soyad, user?.telefon]);

  // ─── Pull-to-Refresh ───
  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  };

  // ─── Profil Güncelle ───
  const onUpdateProfile = async () => {
    const isValid = profileForm.validateAll();
    if (!isValid) return;

    setIsUpdating(true);
    const result = await updateProfile(profileForm.values);
    setIsUpdating(false);

    if (result.success) {
      setIsEditing(false);
      showToast('Profil başarıyla güncellendi ✅', 'success');
    } else {
      showToast(result.error || 'Güncelleme başarısız', 'error');
    }
  };

  // ─── Şifre Değiştir ───
  const onChangePassword = async () => {
    const isValid = passwordForm.validateAll();
    if (!isValid) return;

    setIsChangingPassword(true);
    const result = await changePassword(
      passwordForm.values.mevcutSifre,
      passwordForm.values.yeniSifre
    );
    setIsChangingPassword(false);

    if (result.success) {
      setShowPasswordForm(false);
      passwordForm.resetForm({ mevcutSifre: '', yeniSifre: '' });
      showToast('Şifre başarıyla değiştirildi 🔒', 'success');
    } else {
      showToast(result.error || 'Şifre değiştirilemedi', 'error');
    }
  };

  // ─── Hesap Sil ───
  const onDeleteAccount = async () => {
    setIsDeleting(true);
    const result = await deleteAccount();
    setIsDeleting(false);

    if (result.success) {
      setShowDeleteDialog(false);
      showToast('Hesabınız silindi. Güle güle 👋', 'info');
    } else {
      showToast(result.error || 'Hesap silinemedi', 'error');
    }
  };

  // ─── Çıkış Yap ───
  const onLogout = async () => {
    await logout();
    showToast('Çıkış yapıldı', 'info');
  };

  // ─── Loading State ───
  if (isLoadingProfile) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <ProfileSkeleton />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* ═══ Profil Başlığı ═══ */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{getUserInitials(user)}</Text>
          </View>
          <Text style={styles.userName}>
            {user?.ad} {user?.soyad}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          {user?.olusturmaTarihi && (
            <Text style={styles.memberSince}>
              Üyelik: {formatDate(user.olusturmaTarihi)}
            </Text>
          )}
        </View>

        {/* ═══ Profil Bilgileri / Düzenleme Formu ═══ */}
        <View style={[styles.section, SHADOWS.small]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>👤 Kişisel Bilgiler</Text>
            <TouchableOpacity
              onPress={() => {
                if (isEditing) {
                  // İptal — formu sıfırla
                  profileForm.resetForm({
                    ad: user?.ad || '',
                    soyad: user?.soyad || '',
                    telefon: user?.telefon || '',
                  });
                }
                setIsEditing(!isEditing);
              }}
            >
              <Text style={styles.editButton}>
                {isEditing ? 'İptal' : 'Düzenle ✏️'}
              </Text>
            </TouchableOpacity>
          </View>

          {isEditing ? (
            // ─── Düzenleme Modu ───
            <View>
              <Input
                label="Ad"
                value={profileForm.values.ad}
                onChangeText={(v) => profileForm.handleChange('ad', v)}
                onBlur={() => profileForm.handleBlur('ad')}
                error={profileForm.getError('ad')}
                placeholder="Adınız"
                autoCapitalize="words"
              />
              <Input
                label="Soyad"
                value={profileForm.values.soyad}
                onChangeText={(v) => profileForm.handleChange('soyad', v)}
                onBlur={() => profileForm.handleBlur('soyad')}
                error={profileForm.getError('soyad')}
                placeholder="Soyadınız"
                autoCapitalize="words"
              />
              <Input
                label="Telefon"
                value={profileForm.values.telefon}
                onChangeText={(v) => profileForm.handleChange('telefon', v)}
                onBlur={() => profileForm.handleBlur('telefon')}
                error={profileForm.getError('telefon')}
                placeholder="+905551234567"
                keyboardType="phone-pad"
              />
              <Button
                title="Değişiklikleri Kaydet"
                onPress={onUpdateProfile}
                loading={isUpdating}
                iconLeft="💾"
              />
            </View>
          ) : (
            // ─── Görüntüleme Modu ───
            <View>
              <InfoRow label="Ad" value={user?.ad} />
              <InfoRow label="Soyad" value={user?.soyad} />
              <InfoRow label="E-posta" value={user?.email} />
              <InfoRow label="Telefon" value={user?.telefon || 'Belirtilmemiş'} />
            </View>
          )}
        </View>

        {/* ═══ Adreslerim Kısayolu ═══ */}
        <TouchableOpacity
          style={[styles.section, styles.addressShortcut, SHADOWS.small]}
          onPress={() => navigation.navigate('Addresses')}
          activeOpacity={0.7}
        >
          <View style={styles.shortcutLeft}>
            <Text style={styles.shortcutIcon}>📍</Text>
            <View>
              <Text style={styles.sectionTitle}>Adreslerim</Text>
              <Text style={styles.shortcutSubtitle}>
                {(user?.adresler?.length || 0)} kayıtlı adres
              </Text>
            </View>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* ═══ Şifre Değiştirme ═══ */}
        <View style={[styles.section, SHADOWS.small]}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => {
              if (showPasswordForm) {
                passwordForm.resetForm({ mevcutSifre: '', yeniSifre: '' });
              }
              setShowPasswordForm(!showPasswordForm);
            }}
          >
            <Text style={styles.sectionTitle}>🔒 Şifre Değiştir</Text>
            <Text style={styles.chevron}>
              {showPasswordForm ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showPasswordForm && (
            <View style={styles.passwordForm}>
              <Input
                label="Mevcut Şifre"
                value={passwordForm.values.mevcutSifre}
                onChangeText={(v) => passwordForm.handleChange('mevcutSifre', v)}
                onBlur={() => passwordForm.handleBlur('mevcutSifre')}
                error={passwordForm.getError('mevcutSifre')}
                placeholder="Mevcut şifreniz"
                secureTextEntry
              />
              <Input
                label="Yeni Şifre"
                value={passwordForm.values.yeniSifre}
                onChangeText={(v) => passwordForm.handleChange('yeniSifre', v)}
                onBlur={() => passwordForm.handleBlur('yeniSifre')}
                error={passwordForm.getError('yeniSifre')}
                placeholder="En az 8 karakter"
                secureTextEntry
              />
              <Button
                title="Şifreyi Değiştir"
                onPress={onChangePassword}
                loading={isChangingPassword}
                variant="secondary"
                iconLeft="🔐"
              />
            </View>
          )}
        </View>

        {/* ═══ Tehlikeli Alan — Çıkış ve Hesap Silme ═══ */}
        <View style={styles.dangerZone}>
          <Button
            title="Çıkış Yap"
            onPress={onLogout}
            variant="outline"
            iconLeft="🚪"
          />
          <View style={{ height: SPACING.sm }} />
          <Button
            title="Hesabımı Sil"
            onPress={() => setShowDeleteDialog(true)}
            variant="danger"
            iconLeft="⚠️"
          />
        </View>

        {/* Spacing */}
        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      {/* ═══ Hesap Silme Onay Dialogu ═══ */}
      <ConfirmDialog
        visible={showDeleteDialog}
        icon="🗑️"
        title="Hesabını Silmek İstediğine Emin Misin?"
        message="Bu işlem geri alınamaz. Tüm verileriniz, adresleriniz ve sipariş geçmişiniz kalıcı olarak silinecektir."
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        confirmVariant="danger"
        onConfirm={onDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        loading={isDeleting}
      />
    </View>
  );
};

// ─── Bilgi Satırı Bileşeni ───
const InfoRow = ({ label, value }) => (
  <View style={infoStyles.row}>
    <Text style={infoStyles.label}>{label}</Text>
    <Text style={infoStyles.value}>{value || '—'}</Text>
  </View>
);

const infoStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  label: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  value: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.md,
  },
});

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.screenPadding,
    paddingTop: SPACING.md,
  },

  // Profile Header
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  avatarContainer: {
    width: SPACING.avatarLg,
    height: SPACING.avatarLg,
    borderRadius: SPACING.avatarLg / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textInverse,
  },
  userName: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  memberSince: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textTertiary,
    marginTop: SPACING.xs,
  },

  // Sections
  section: {
    backgroundColor: COLORS.white,
    borderRadius: SPACING.radiusLg,
    padding: SPACING.cardPadding,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h4,
    color: COLORS.textPrimary,
  },
  editButton: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
  },

  // Address Shortcut
  addressShortcut: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  shortcutLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shortcutIcon: {
    fontSize: 28,
    marginRight: SPACING.md,
  },
  shortcutSubtitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.textTertiary,
  },

  // Password Form
  passwordForm: {
    marginTop: SPACING.sm,
  },

  // Danger Zone
  dangerZone: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
});

export default ProfileScreen;
