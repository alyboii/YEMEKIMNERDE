// ─────────────────────────────────────────────
// Admin Dashboard — API Bağlantılı Yönetim Paneli
// Siparişler, Restoranlar, Menü Yönetimi
// ─────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  Modal,
} from 'react-native';
import api from '../../services/api';

// ─── Durum Renkleri ───
const STATUS_CONFIG = {
  beklemede:      { label: 'Beklemede',      color: '#E2A257', bg: 'rgba(226,162,87,0.1)' },
  hazirlaniyor:   { label: 'Hazırlanıyor',   color: '#42A5F5', bg: 'rgba(66,165,245,0.1)' },
  yolda:          { label: 'Yolda',          color: '#AB47BC', bg: 'rgba(171,71,188,0.1)' },
  teslim_edildi:  { label: 'Teslim Edildi',  color: '#00E676', bg: 'rgba(0,230,118,0.1)' },
  iptal:          { label: 'İptal',          color: '#ffb4ab', bg: 'rgba(255,180,171,0.1)' },
};

// ─── Tab Seçenekleri ───
const TABS = [
  { key: 'orders', label: '📦 Siparişler' },
  { key: 'restaurants', label: '🍽️ Restoranlar' },
];

const AdminDashboardScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Modal state (Restoran Ekleme) ───
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestoran, setNewRestoran] = useState({ ad: '', kategori: '', calismaSaatleri: '', adres: '', telefon: '' });

  // ─── Modal state (Menü Yönetimi) ───
  const [selectedRestaurantForMenu, setSelectedRestaurantForMenu] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({ ad: '', aciklama: '', fiyat: '', kategori: '' });

  // ════════════════════════════════════════════
  // Veri Çekme
  // ════════════════════════════════════════════
  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data?.siparisler || res.data || []);
    } catch (e) {
      console.warn('Siparişler yüklenemedi:', e.message || e);
    }
  }, []);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await api.get('/restaurants');
      setRestaurants(res.data?.restoranlar || res.data || []);
    } catch (e) {
      console.warn('Restoranlar yüklenemedi:', e.message || e);
    }
  }, []);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchRestaurants()]);
    setLoading(false);
  }, [fetchOrders, fetchRestaurants]);

  useEffect(() => { loadAll(); }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAll();
    setRefreshing(false);
  };

  // ════════════════════════════════════════════
  // Sipariş İşlemleri
  // ════════════════════════════════════════════
  const updateOrderStatus = async (siparisId, durum) => {
    try {
      await api.put(`/orders/${siparisId}/status`, { durum });
      Alert.alert('Başarılı', `Sipariş durumu "${STATUS_CONFIG[durum]?.label}" olarak güncellendi.`);
      fetchOrders();
    } catch (e) {
      Alert.alert('Hata', e.message || 'Durum güncellenemedi.');
    }
  };

  const cancelOrder = async (siparisId) => {
    Alert.alert('Emin misin?', 'Bu sipariş iptal edilecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'İptal Et', style: 'destructive', onPress: async () => {
          try {
            await api.post(`/orders/${siparisId}/cancel`);
            Alert.alert('Başarılı', 'Sipariş iptal edildi.');
            fetchOrders();
          } catch (e) {
            Alert.alert('Hata', e.message || 'Sipariş iptal edilemedi.');
          }
        }
      }
    ]);
  };

  // ════════════════════════════════════════════
  // Restoran İşlemleri
  // ════════════════════════════════════════════
  const addRestoran = async () => {
    if (!newRestoran.ad) { Alert.alert('Uyarı', 'Restoran adı giriniz.'); return; }
    try {
      await api.post('/restaurants', newRestoran);
      Alert.alert('Başarılı', `"${newRestoran.ad}" eklendi!`);
      setShowAddModal(false);
      setNewRestoran({ ad: '', kategori: '', calismaSaatleri: '', adres: '', telefon: '' });
      fetchRestaurants();
    } catch (e) {
      Alert.alert('Hata', e.message || 'Restoran eklenemedi.');
    }
  };

  const deleteRestoran = (id, ad) => {
    Alert.alert('Emin misin?', `"${ad}" silinecek.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/restaurants/${id}`);
            Alert.alert('Başarılı', 'Restoran silindi.');
            fetchRestaurants();
          } catch (e) {
            Alert.alert('Hata', e.message || 'Silinemedi.');
          }
        }
      }
    ]);
  };

  // ════════════════════════════════════════════
  // Menü İşlemleri
  // ════════════════════════════════════════════
  const addMenuItem = async () => {
    if (!newMenuItem.ad || !newMenuItem.fiyat) {
      Alert.alert('Uyarı', 'Ad ve fiyat zorunludur.');
      return;
    }
    try {
      await api.post(`/restaurants/${selectedRestaurantForMenu._id || selectedRestaurantForMenu.id}/menu`, {
        ...newMenuItem,
        fiyat: parseFloat(newMenuItem.fiyat)
      });
      Alert.alert('Başarılı', `"${newMenuItem.ad}" menüye eklendi!`);
      setNewMenuItem({ ad: '', aciklama: '', fiyat: '', kategori: '' });
      fetchRestaurants(); // Refresh restaurants to get updated menu
      
      // Update selected restaurant locally to show new item instantly
      const res = await api.get(`/restaurants/${selectedRestaurantForMenu._id || selectedRestaurantForMenu.id}`);
      setSelectedRestaurantForMenu(res.data);
    } catch (e) {
      Alert.alert('Hata', e.message || 'Ürün eklenemedi.');
    }
  };

  const deleteMenuItem = (urunId, urunAd) => {
    Alert.alert('Emin misin?', `"${urunAd}" menüden silinecek.`, [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil', style: 'destructive', onPress: async () => {
          try {
            const rId = selectedRestaurantForMenu._id || selectedRestaurantForMenu.id;
            await api.delete(`/restaurants/${rId}/menu/${urunId}`);
            Alert.alert('Başarılı', 'Ürün silindi.');
            fetchRestaurants();
            
            // Update selected restaurant locally
            const res = await api.get(`/restaurants/${rId}`);
            setSelectedRestaurantForMenu(res.data);
          } catch (e) {
            Alert.alert('Hata', e.message || 'Ürün silinemedi.');
          }
        }
      }
    ]);
  };

  // ════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════
  const renderBadge = (durum) => {
    const cfg = STATUS_CONFIG[durum] || STATUS_CONFIG.beklemede;
    return (
      <View style={[s.badge, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
        <Text style={[s.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
      </View>
    );
  };

  const renderOrderCard = (order) => {
    const id = order._id || order.id;
    const durum = order.durum || 'beklemede';
    const urunler = order.urunler || [];
    const urunText = urunler.map(u => `${u.adet || 1}x ${u.ad || 'Ürün'}`).join(', ') || 'Ürün bilgisi yok';
    const toplam = order.toplamTutar || 0;

    return (
      <View key={id} style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardId}>#{id?.slice(-6).toUpperCase()}</Text>
          {renderBadge(durum)}
        </View>
        <Text style={s.cardDesc}>{urunText}</Text>
        {toplam > 0 && <Text style={s.cardPrice}>₺{toplam.toFixed(2)}</Text>}

        {durum === 'beklemede' && (
          <View style={s.actions}>
            <TouchableOpacity style={s.btnAccept} onPress={() => updateOrderStatus(id, 'hazirlaniyor')}>
              <Text style={s.btnAcceptText}>HAZIRLANIYOR</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnReject} onPress={() => cancelOrder(id)}>
              <Text style={s.btnRejectText}>İPTAL</Text>
            </TouchableOpacity>
          </View>
        )}
        {durum === 'hazirlaniyor' && (
          <TouchableOpacity style={[s.btnAccept, { marginTop: 12 }]} onPress={() => updateOrderStatus(id, 'yolda')}>
            <Text style={s.btnAcceptText}>YOLA ÇIKAR</Text>
          </TouchableOpacity>
        )}
        {durum === 'yolda' && (
          <TouchableOpacity style={[s.btnAccept, { marginTop: 12, backgroundColor: '#42A5F5' }]} onPress={() => updateOrderStatus(id, 'teslim_edildi')}>
            <Text style={s.btnAcceptText}>TESLİM EDİLDİ</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  // Çalışma saatlerini okunabilir stringe çevir
  const formatSaatler = (saatler) => {
    if (!saatler) return null;
    if (typeof saatler === 'string') return saatler;
    if (Array.isArray(saatler)) {
      return saatler.map(s => `${s.gun || ''}: ${s.acilis || ''}-${s.kapanis || ''}`).join(', ');
    }
    if (typeof saatler === 'object') {
      return `${saatler.gun || ''}: ${saatler.acilis || ''}-${saatler.kapanis || ''}`.trim();
    }
    return String(saatler);
  };

  const renderRestaurantCard = (r) => {
    const id = r._id || r.id;
    const saatText = formatSaatler(r.calismaSaatleri);
    return (
      <View key={id} style={s.card}>
        <View style={s.cardHeader}>
          <Text style={s.cardId}>{r.ad}</Text>
          <View style={[s.badge, { backgroundColor: 'rgba(0,230,118,0.1)', borderColor: '#00E676' }]}>
            <Text style={[s.badgeText, { color: '#00E676' }]}>{r.kategori || 'Genel'}</Text>
          </View>
        </View>
        {r.adres && <Text style={s.cardDesc}>📍 {typeof r.adres === 'object' ? JSON.stringify(r.adres) : r.adres}</Text>}
        {saatText && <Text style={s.cardSubDesc}>🕐 {saatText}</Text>}
        {r.telefon && <Text style={s.cardSubDesc}>📞 {r.telefon}</Text>}
        <View style={s.actions}>
          <TouchableOpacity activeOpacity={0.7} style={[s.btnAccept, { backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#00E676' }]} onPress={() => setSelectedRestaurantForMenu(r)}>
            <Text style={[s.btnAcceptText, { color: '#00E676' }]}>MENÜYÜ YÖNET</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={s.btnReject} onPress={() => deleteRestoran(id, r.ad)}>
            <Text style={s.btnRejectText}>SİL</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* ─── Header ─── */}
      <View style={s.header}>
        <Text style={s.headerTitle}>ADMIN PANEL</Text>
        <TouchableOpacity activeOpacity={0.7} style={s.logoutBtn} onPress={() => navigation.replace('Login')}>
          <Text style={s.logoutText}>Çıkış</Text>
        </TouchableOpacity>
      </View>

      {/* ─── Stats ─── */}
      <View style={s.statsRow}>
        <View style={s.statBox}>
          <Text style={s.statValue}>{orders.length}</Text>
          <Text style={s.statLabel}>Sipariş</Text>
        </View>
        <View style={s.statBox}>
          <Text style={[s.statValue, { color: '#42A5F5' }]}>{restaurants.length}</Text>
          <Text style={s.statLabel}>Restoran</Text>
        </View>
        <View style={s.statBox}>
          <Text style={[s.statValue, { color: '#E2A257' }]}>
            {orders.filter(o => o.durum === 'beklemede').length}
          </Text>
          <Text style={s.statLabel}>Bekleyen</Text>
        </View>
      </View>

      {/* ─── Tabs ─── */}
      <View style={s.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            activeOpacity={0.7}
            key={tab.key}
            style={[s.tab, activeTab === tab.key && s.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[s.tabText, activeTab === tab.key && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ─── Content ─── */}
      {loading ? (
        <View style={s.center}><ActivityIndicator size="large" color="#00E676" /></View>
      ) : (
        <ScrollView
          contentContainerStyle={s.content}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00E676" />}
        >
          {activeTab === 'orders' && (
            <>
              {orders.length === 0 ? (
                <View style={s.emptyBox}><Text style={s.emptyText}>Henüz sipariş yok</Text></View>
              ) : (
                orders.map(renderOrderCard)
              )}
            </>
          )}

          {activeTab === 'restaurants' && (
            <>
              <TouchableOpacity activeOpacity={0.7} style={s.addBtn} onPress={() => setShowAddModal(true)}>
                <Text style={s.addBtnText}>+ YENİ RESTORAN EKLE</Text>
              </TouchableOpacity>
              {restaurants.length === 0 ? (
                <View style={s.emptyBox}><Text style={s.emptyText}>Henüz restoran yok</Text></View>
              ) : (
                restaurants.map(renderRestaurantCard)
              )}
            </>
          )}
        </ScrollView>
      )}

      {/* ─── Restoran Ekleme Modal ─── */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Yeni Restoran Ekle</Text>

            {[
              { key: 'ad', placeholder: 'Restoran Adı *', icon: '🍽️' },
              { key: 'kategori', placeholder: 'Kategori (Türk Mutfağı, Fast Food...)', icon: '🏷️' },
              { key: 'calismaSaatleri', placeholder: 'Çalışma Saatleri (09:00-22:00)', icon: '🕐' },
              { key: 'adres', placeholder: 'Adres', icon: '📍' },
              { key: 'telefon', placeholder: 'Telefon', icon: '📞' },
            ].map(field => (
              <View key={field.key} style={s.modalInputRow}>
                <Text style={s.modalInputIcon}>{field.icon}</Text>
                <TextInput
                  style={s.modalInput}
                  placeholder={field.placeholder}
                  placeholderTextColor="#666"
                  value={newRestoran[field.key]}
                  onChangeText={v => setNewRestoran(prev => ({ ...prev, [field.key]: v }))}
                />
              </View>
            ))}

            <View style={s.modalActions}>
              <TouchableOpacity activeOpacity={0.7} style={s.modalCancelBtn} onPress={() => setShowAddModal(false)}>
                <Text style={s.modalCancelText}>Vazgeç</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={s.modalSaveBtn} onPress={addRestoran}>
                <Text style={s.modalSaveText}>EKLE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Menü Yönetimi Modal ─── */}
      <Modal visible={!!selectedRestaurantForMenu} animationType="slide" transparent>
        <View style={s.modalOverlay}>
          <View style={[s.modalContent, { maxHeight: '90%' }]}>
            <View style={s.modalHeaderRow}>
              <Text style={[s.modalTitle, { marginBottom: 0 }]}>{selectedRestaurantForMenu?.ad} Menüsü</Text>
              <TouchableOpacity onPress={() => setSelectedRestaurantForMenu(null)}>
                <Text style={s.closeIcon}>✖</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300, marginBottom: 24 }} showsVerticalScrollIndicator={false}>
              {(!selectedRestaurantForMenu?.menu || selectedRestaurantForMenu.menu.length === 0) ? (
                <Text style={s.emptyText}>Bu restorana henüz menü eklenmemiş.</Text>
              ) : (
                selectedRestaurantForMenu.menu.map((urun) => (
                  <View key={urun._id || urun.id} style={s.menuItemCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={s.menuItemName}>{urun.ad}</Text>
                      <Text style={s.menuItemDesc}>{urun.aciklama}</Text>
                      <Text style={s.menuItemPrice}>₺{urun.fiyat}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7} style={s.menuItemDeleteBtn} onPress={() => deleteMenuItem(urun._id || urun.id, urun.ad)}>
                      <Text style={s.deleteIcon}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>

            <Text style={s.sectionTitle}>YENİ YEMEK EKLE</Text>
            {[
              { key: 'ad', placeholder: 'Yemek Adı *', keyboardType: 'default' },
              { key: 'aciklama', placeholder: 'Açıklama (İçindekiler vb.)', keyboardType: 'default' },
              { key: 'fiyat', placeholder: 'Fiyat (örn: 150) *', keyboardType: 'numeric' },
              { key: 'kategori', placeholder: 'Kategori (Ana Yemek, İçecek vb.)', keyboardType: 'default' },
            ].map(field => (
              <TextInput
                key={field.key}
                style={s.modalInput}
                placeholder={field.placeholder}
                placeholderTextColor="#666"
                keyboardType={field.keyboardType}
                value={newMenuItem[field.key]}
                onChangeText={v => setNewMenuItem(prev => ({ ...prev, [field.key]: v }))}
              />
            ))}

            <TouchableOpacity activeOpacity={0.7} style={[s.modalSaveBtn, { marginTop: 16 }]} onPress={addMenuItem}>
              <Text style={s.modalSaveText}>MENÜYE EKLE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ════════════════════════════════════════════
// STYLES
// ════════════════════════════════════════════
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)', backgroundColor: '#121212' },
  headerTitle: { color: '#00E676', fontSize: 20, fontWeight: '800', letterSpacing: 2 },
  logoutBtn: { backgroundColor: '#1f1f1f', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: '#353535' },
  logoutText: { color: '#ffb4ab', fontSize: 13, fontWeight: '700' },

  // Stats
  statsRow: { flexDirection: 'row', padding: 16, gap: 8 },
  statBox: { flex: 1, backgroundColor: '#121212', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1f1f1f', alignItems: 'center' },
  statValue: { color: '#00E676', fontSize: 28, fontWeight: '900', marginBottom: 2 },
  statLabel: { color: '#666', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },

  // Tabs
  tabBar: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#121212', borderRadius: 12, padding: 4, borderWidth: 1, borderColor: '#1f1f1f' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#1f1f1f' },
  tabText: { color: '#666', fontSize: 14, fontWeight: '700' },
  tabTextActive: { color: '#00E676' },

  // Content
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  // Cards
  card: { backgroundColor: '#121212', padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1f1f1f' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardId: { color: '#e2e2e2', fontSize: 16, fontWeight: '700', flex: 1 },
  cardDesc: { color: '#A0A0A0', fontSize: 14, marginBottom: 4 },
  cardSubDesc: { color: '#666', fontSize: 13, marginBottom: 2 },
  cardPrice: { color: '#00E676', fontSize: 16, fontWeight: '800', marginTop: 8 },

  // Badge
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1 },
  badgeText: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  // Buttons
  actions: { flexDirection: 'row', marginTop: 12, gap: 8 },
  btnAccept: { flex: 1, backgroundColor: '#00E676', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnAcceptText: { color: '#000', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  btnReject: { flex: 1, backgroundColor: '#1f1f1f', paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#353535' },
  btnRejectText: { color: '#ffb4ab', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  btnDelete: { backgroundColor: '#1f1f1f', paddingVertical: 10, borderRadius: 10, alignItems: 'center', marginTop: 12, borderWidth: 1, borderColor: '#353535' },

  addBtn: { backgroundColor: '#121212', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#00E676', borderStyle: 'dashed' },
  addBtnText: { color: '#00E676', fontSize: 14, fontWeight: '800', letterSpacing: 1 },

  // Empty
  emptyBox: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 16 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#121212', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  modalTitle: { color: '#e2e2e2', fontSize: 20, fontWeight: '700', marginBottom: 24, textAlign: 'center', letterSpacing: 1 },
  modalInputRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', paddingLeft: 14 },
  modalInputIcon: { fontSize: 16, marginRight: 10 },
  modalInput: { flex: 1, paddingVertical: 14, paddingRight: 16, color: '#e2e2e2', fontSize: 15 },
  modalActions: { flexDirection: 'row', marginTop: 16, gap: 12 },
  modalCancelBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#1f1f1f', borderWidth: 1, borderColor: '#353535' },
  modalCancelText: { color: '#A0A0A0', fontSize: 15, fontWeight: '700' },
  modalSaveBtn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center', backgroundColor: '#00E676' },
  modalSaveText: { color: '#000', fontSize: 15, fontWeight: '900', letterSpacing: 0.5 },

  // Menu Items Modal
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  closeIcon: { color: '#A0A0A0', fontSize: 24 },
  menuItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A1A', padding: 16, borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  menuItemName: { color: '#E2E2E2', fontSize: 16, fontWeight: '700', marginBottom: 4 },
  menuItemDesc: { color: '#A0A0A0', fontSize: 13, marginBottom: 8 },
  menuItemPrice: { color: '#00E676', fontSize: 14, fontWeight: '800' },
  menuItemDeleteBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,180,171,0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,180,171,0.2)' },
  deleteIcon: { fontSize: 16 },
});

export default AdminDashboardScreen;
