// ─────────────────────────────────────────────
// Ayarlar Ekranı — Şifre Güncelleme + Hesap Silme
// PUT /users/{userId}/password
// DELETE /users/{userId}
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar,
  ScrollView, Switch, Alert, Modal, TextInput,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const SettingsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const { changePassword, deleteAccount, logout } = useAuth();

  // ─── Şifre Değiştirme Modal ───
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [mevcutSifre, setMevcutSifre] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePassword = async () => {
    if (!mevcutSifre || !yeniSifre) {
      Alert.alert('Uyarı', 'Tüm alanları doldurun.');
      return;
    }
    if (yeniSifre.length < 8) {
      Alert.alert('Uyarı', 'Yeni şifre en az 8 karakter olmalıdır.');
      return;
    }

    setIsSaving(true);
    const result = await changePassword(mevcutSifre, yeniSifre);
    setIsSaving(false);

    if (result.success) {
      Alert.alert('Başarılı ✅', 'Şifreniz güncellendi. Lütfen tekrar giriş yapın.', [
        { text: 'Tamam', onPress: async () => {
            setShowPasswordModal(false);
            await logout();
        }}
      ]);
      setMevcutSifre('');
      setYeniSifre('');
    } else {
      Alert.alert('Hata', result.error || 'Şifre değiştirilemedi.');
    }
  };

  // ─── Hesap Silme ───
  const handleDeleteAccount = () => {
    Alert.alert(
      '⚠️ Hesabı Sil',
      'Bu işlem geri alınamaz! Hesabınız ve tüm verileriniz kalıcı olarak silinecek.',
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Evet, Sil',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAccount();
            if (result.success) {
              Alert.alert('Hesap Silindi', 'Hesabınız başarıyla silindi.', [
                { text: 'Tamam', onPress: () => navigation.replace('Onboarding') }
              ]);
            } else {
              Alert.alert('Hata', result.error || 'Hesap silinemedi.');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={s.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>AYARLAR</Text>
        <View style={s.headerBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={s.content}>

        <Text style={s.sectionTitle}>TERCİHLER</Text>

        <View style={s.settingItem}>
          <View>
            <Text style={s.settingTitle}>Bildirimler</Text>
            <Text style={s.settingDesc}>Sipariş bildirimleri ve kampanyalar</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: '#353535', true: '#00E676' }}
            thumbColor="#ffffff"
          />
        </View>

        <View style={s.settingItem}>
          <View>
            <Text style={s.settingTitle}>Konum Servisleri</Text>
            <Text style={s.settingDesc}>Doğru teslimat takibi için</Text>
          </View>
          <Switch
            value={location}
            onValueChange={setLocation}
            trackColor={{ false: '#353535', true: '#00E676' }}
            thumbColor="#ffffff"
          />
        </View>

        <Text style={[s.sectionTitle, { marginTop: 32 }]}>HESAP</Text>

        <TouchableOpacity style={s.settingItem} onPress={() => setShowPasswordModal(true)}>
          <Text style={s.settingTitle}>Şifreyi Değiştir</Text>
          <Text style={s.chevron}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[s.settingItem, { borderBottomWidth: 0 }]} onPress={handleDeleteAccount}>
          <Text style={[s.settingTitle, { color: '#ffb4ab' }]}>Hesabı Sil</Text>
          <Text style={[s.chevron, { color: '#ffb4ab' }]}>›</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ─── Şifre Değiştirme Modal ─── */}
      <Modal visible={showPasswordModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Şifre Değiştir</Text>

            <TextInput
              style={s.modalInput}
              placeholder="Mevcut Şifre"
              placeholderTextColor="#666"
              secureTextEntry
              value={mevcutSifre}
              onChangeText={setMevcutSifre}
            />
            <TextInput
              style={s.modalInput}
              placeholder="Yeni Şifre (min 8 karakter)"
              placeholderTextColor="#666"
              secureTextEntry
              value={yeniSifre}
              onChangeText={setYeniSifre}
            />

            <View style={s.modalActions}>
              <TouchableOpacity style={s.modalCancelBtn} onPress={() => { setShowPasswordModal(false); setMevcutSifre(''); setYeniSifre(''); }}>
                <Text style={s.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalSaveBtn, isSaving && { opacity: 0.6 }]} onPress={handleChangePassword} disabled={isSaving}>
                <Text style={s.modalSaveText}>{isSaving ? 'Kaydediliyor...' : 'GÜNCELLE'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerBtn: { padding: 8, width: 48, alignItems: 'flex-start' },
  headerBtnSpacer: { width: 48 },
  headerIcon: { color: '#e2e2e2', fontSize: 24 },
  headerTitle: { color: '#A0A0A0', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  content: { padding: 20 },
  sectionTitle: { color: '#bacbb9', fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 16 },
  settingItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f1f1f', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2C2C2C' },
  settingTitle: { color: '#e2e2e2', fontSize: 16, fontWeight: '600' },
  settingDesc: { color: '#A0A0A0', fontSize: 13, marginTop: 4 },
  chevron: { color: '#A0A0A0', fontSize: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: '#2C2C2C' },
  modalTitle: { color: '#e2e2e2', fontSize: 20, fontWeight: '800', marginBottom: 24, textAlign: 'center' },
  modalInput: { backgroundColor: '#1f1f1f', borderRadius: 10, paddingVertical: 14, paddingHorizontal: 16, color: '#e2e2e2', fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#2C2C2C' },
  modalActions: { flexDirection: 'row', marginTop: 8, gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#353535' },
  modalCancelText: { color: '#A0A0A0', fontSize: 15, fontWeight: '700' },
  modalSaveBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#00E676' },
  modalSaveText: { color: '#000', fontSize: 15, fontWeight: '900' },
});

export default SettingsScreen;
