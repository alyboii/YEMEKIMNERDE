// ─────────────────────────────────────────────
// Adreslerim Ekranı — Gerçek API + Adres Silme
// GET  /users/{userId} (adresler dizisi)
// DELETE /users/{userId}/addresses/{addressId}
// ─────────────────────────────────────────────

import React, { useEffect } from 'react';
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
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const AddressesScreen = ({ navigation }) => {
  const { user, refreshAddresses, deleteAddress, isLoading } = useAuth();
  const addresses = user?.adresler || [];

  useEffect(() => {
    refreshAddresses();
  }, []);

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
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ─── Header ─── */}
      <View style={s.header}>
        <TouchableOpacity style={s.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={s.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={s.headerTitle}>YEMEKİMNERDE</Text>
        <View style={{ width: 48 }} />
      </View>

      {/* ─── Main Content ─── */}
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>

        <View style={s.titleSection}>
          <Text style={s.mainTitle}>Saved Addresses</Text>
          <Text style={s.subTitle}>Manage your delivery locations</Text>
        </View>

        {isLoading && addresses.length === 0 ? (
          <ActivityIndicator color="#00e676" style={{ marginTop: 40 }} />
        ) : addresses.length === 0 ? (
          <View style={s.emptyBox}>
            <Text style={s.emptyIcon}>📍</Text>
            <Text style={s.emptyText}>Henüz kayıtlı adres yok</Text>
          </View>
        ) : (
          addresses.map((item, index) => {
            const id = item._id || item.id;
            const title = item.baslik || item.title || (index === 0 ? 'Home' : 'Address');
            const adresText = typeof item.adres === 'object'
              ? `${item.adres.sokak || ''}, ${item.adres.ilce || ''} ${item.adres.il || ''}`.trim()
              : (item.adres || item.address || '');

            return (
              <View key={id} style={[s.card, index === 0 && s.cardPrimary]}>
                <View style={s.cardHeader}>
                  <View style={s.cardHeaderLeft}>
                    <View style={[s.iconBox, index === 0 ? s.iconBoxPrimary : s.iconBoxSecondary]}>
                      <Text style={s.cardIcon}>{index === 0 ? '🏠' : '📍'}</Text>
                    </View>
                    <View style={s.titleGroup}>
                      <Text style={s.cardTitle}>{title}</Text>
                      {index === 0 && <Text style={s.primaryBadge}>PRIMARY</Text>}
                    </View>
                  </View>

                  {/* Sil Butonu */}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  headerBtn: { padding: 8, width: 48 },
  headerIcon: { color: '#e2e2e2', fontSize: 24 },
  headerTitle: { color: '#00e676', fontSize: 18, fontWeight: '800', letterSpacing: 2.5 },

  scrollContent: { padding: 20, paddingBottom: 100 },
  titleSection: { marginBottom: 24 },
  mainTitle: { color: '#FFFFFF', fontSize: 26, fontWeight: '700', marginBottom: 8 },
  subTitle: { color: '#A0A0A0', fontSize: 16 },

  card: { backgroundColor: '#121212', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', borderRadius: 18, padding: 24, marginBottom: 20 },
  cardPrimary: { borderColor: 'rgba(0,230,118,0.2)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16, borderWidth: 1 },
  iconBoxPrimary: { backgroundColor: 'rgba(0,230,118,0.1)', borderColor: 'rgba(0,230,118,0.2)' },
  iconBoxSecondary: { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' },
  cardIcon: { fontSize: 24 },
  titleGroup: { justifyContent: 'center' },
  cardTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '600', marginBottom: 4 },
  primaryBadge: { color: '#00e676', fontSize: 10, fontWeight: '800', letterSpacing: 1 },

  deleteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,180,171,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,180,171,0.2)' },
  deleteIcon: { fontSize: 16 },

  cardBody: { marginBottom: 8 },
  addressText: { color: '#A0A0A0', fontSize: 16, lineHeight: 24 },

  emptyBox: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#666', fontSize: 16 },
});

export default AddressesScreen;
