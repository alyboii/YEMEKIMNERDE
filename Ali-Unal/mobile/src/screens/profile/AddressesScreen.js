// ─────────────────────────────────────────────
// Adreslerim Ekranı — Adres Ekle / Sil
// GET    /users/{userId} (adresler dizisi)
// POST   /users/{userId}/addresses
// DELETE /users/{userId}/addresses/{addressId}
// ─────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const AddressesScreen = ({ navigation }) => {
  const { user, refreshAddresses, deleteAddress, addAddress, isLoading } = useAuth();
  const addresses = user?.adresler || [];

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    baslik: '',
    sokak: '',
    ilce: '',
    il: '',
    postaKodu: '',
  });

  useEffect(() => {
    refreshAddresses();
  }, []);

  const resetForm = () => {
    setForm({ baslik: '', sokak: '', ilce: '', il: '', postaKodu: '' });
  };

  const handleAdd = async () => {
    if (!form.baslik.trim() || !form.sokak.trim() || !form.il.trim()) {
      Alert.alert('Eksik Bilgi', 'Başlık, sokak ve il alanları zorunludur.');
      return;
    }

    setSaving(true);
    const result = await addAddress({
      baslik: form.baslik.trim(),
      adres: `${form.sokak.trim()}, ${form.ilce.trim()} ${form.postaKodu.trim()}`.trim(),
      sehir: form.il.trim(),
    });
    setSaving(false);

    if (result?.success) {
      setModalVisible(false);
      resetForm();
      await refreshAddresses();
      Alert.alert('Başarılı', 'Adres eklendi.');
    } else {
      Alert.alert('Hata', result?.error || 'Adres eklenemedi.');
    }
  };

  const handleDelete = (adresId, title) => {
    Alert.alert(
      'Adresi Sil',
      `"${title || 'Bu adres'}" silinecek. Emin misin?`,
      [
        { text: 'Vazgeç', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteAddress(adresId);
            if (result.success) {
              Alert.alert('Başarılı', 'Adres silindi.');
            } else {
              Alert.alert('Hata', result.error || 'Adres silinemedi.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ─── Header ─── */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={s.headerIcon}>❮</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>YEMEKİMNERDE</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* ─── Main Content ─── */}
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={s.titleSection}>
          <Text style={s.mainTitle}>Adreslerim</Text>
          <Text style={s.subTitle}>Teslimat adreslerini yönet</Text>
        </View>

        {isLoading && addresses.length === 0 ? (
          <ActivityIndicator color="#00e676" style={{ marginTop: 40 }} />
        ) : addresses.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyIcon}>📍</Text>
            <Text style={s.emptyText}>Henüz kayıtlı adres yok</Text>
            <Text style={s.emptySubText}>Aşağıdaki butona tıklayarak adres ekleyebilirsin</Text>
          </View>
        ) : (
          addresses.map((item, index) => {
            const id = item._id || item.id;
            const title = item.baslik || item.title || (index === 0 ? 'Ev' : 'Adres');
            const adresText =
              typeof item.adres === 'object'
                ? `${item.adres.sokak || ''}, ${item.adres.ilce || ''} ${item.adres.il || ''}`.trim()
                : item.adres || item.address || '';

            return (
              <View key={id} style={[s.card, index === 0 && s.cardPrimary]}>
                <View style={s.cardHeader}>
                  <View style={s.cardHeaderLeft}>
                    <View style={[s.iconBox, index === 0 ? s.iconBoxPrimary : s.iconBoxSecondary]}>
                      <Text style={s.cardIcon}>{index === 0 ? '🏠' : '📍'}</Text>
                    </View>
                    <View style={s.titleGroup}>
                      <Text style={s.cardTitle}>{title}</Text>
                      {index === 0 && <Text style={s.primaryBadge}>VARSAYILAN</Text>}
                    </View>
                  </View>
                  <TouchableOpacity style={s.deleteBtn} onPress={() => handleDelete(id, title)}>
                    <Text style={s.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
                <View style={s.cardBody}>
                  <Text style={s.addressText}>{adresText}</Text>
                </View>
              </View>
            );
          })
        )}

        {/* Adres Ekle Butonu */}
        <TouchableOpacity style={s.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={s.addBtnIcon}>＋</Text>
          <Text style={s.addBtnText}>Yeni Adres Ekle</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ─── Adres Ekle Modal ─── */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <KeyboardAvoidingView
          style={s.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={s.modalCard}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Yeni Adres</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); resetForm(); }}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Başlık */}
              <Text style={s.label}>Adres Başlığı *</Text>
              <TextInput
                style={s.input}
                placeholder="Örn: Ev, İş, Okul"
                placeholderTextColor="#555"
                value={form.baslik}
                onChangeText={(t) => setForm({ ...form, baslik: t })}
              />

              {/* Sokak */}
              <Text style={s.label}>Sokak / Cadde *</Text>
              <TextInput
                style={s.input}
                placeholder="Örn: Atatürk Cad. No:12"
                placeholderTextColor="#555"
                value={form.sokak}
                onChangeText={(t) => setForm({ ...form, sokak: t })}
              />

              {/* İlçe */}
              <Text style={s.label}>İlçe</Text>
              <TextInput
                style={s.input}
                placeholder="Örn: Kadıköy"
                placeholderTextColor="#555"
                value={form.ilce}
                onChangeText={(t) => setForm({ ...form, ilce: t })}
              />

              {/* İl */}
              <Text style={s.label}>İl *</Text>
              <TextInput
                style={s.input}
                placeholder="Örn: İstanbul"
                placeholderTextColor="#555"
                value={form.il}
                onChangeText={(t) => setForm({ ...form, il: t })}
              />

              {/* Posta Kodu */}
              <Text style={s.label}>Posta Kodu</Text>
              <TextInput
                style={s.input}
                placeholder="Örn: 34710"
                placeholderTextColor="#555"
                keyboardType="numeric"
                value={form.postaKodu}
                onChangeText={(t) => setForm({ ...form, postaKodu: t })}
              />

              <TouchableOpacity
                style={[s.saveBtn, saving && { opacity: 0.6 }]}
                onPress={handleAdd}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={s.saveBtnText}>Kaydet</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerBtn: { padding: 8, width: 48 },
  headerIcon: { color: '#00e676', fontSize: 18, fontWeight: '700' },
  headerTitle: { color: '#00e676', fontSize: 18, fontWeight: '800', letterSpacing: 2.5 },

  scrollContent: { padding: 20, paddingBottom: 120 },
  titleSection: { marginBottom: 24 },
  mainTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subTitle: { color: '#A0A0A0', fontSize: 16 },

  card: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 24,
    marginBottom: 20,
  },
  cardPrimary: { borderColor: 'rgba(0,230,118,0.2)' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  iconBoxPrimary: {
    backgroundColor: 'rgba(0,230,118,0.1)',
    borderColor: 'rgba(0,230,118,0.2)',
  },
  iconBoxSecondary: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardIcon: { fontSize: 24 },
  titleGroup: { justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  primaryBadge: { color: '#00e676', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,180,171,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,180,171,0.2)',
  },
  deleteIcon: { fontSize: 16 },
  cardBody: { marginBottom: 8 },
  addressText: { color: '#A0A0A0', fontSize: 16, lineHeight: 24 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptySubText: { color: '#555', fontSize: 14, textAlign: 'center' },

  // Adres Ekle Butonu
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00e676',
    borderRadius: 999,
    paddingVertical: 16,
    gap: 8,
    marginTop: 8,
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  addBtnIcon: { color: '#000', fontSize: 20, fontWeight: '800' },
  addBtnText: { color: '#000', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700' },
  modalClose: { color: '#888', fontSize: 20, padding: 4 },

  label: { color: '#A0A0A0', fontSize: 13, fontWeight: '600', marginBottom: 8, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#1A1A1A',
    color: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  saveBtn: {
    backgroundColor: '#00e676',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#00e676',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  saveBtnText: { color: '#000', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
});

export default AddressesScreen;
