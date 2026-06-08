// ─────────────────────────────────────────────
// Profil Ekranı — Gerçek API Verileriyle
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
  Image,
  ActivityIndicator,
} from 'react-native';
import useAuth from '../../hooks/useAuth';

const MENU_ITEMS = [
  { id: '8', title: 'Ana Sayfa', icon: '🏠', screen: 'Home' },
  { id: '7', title: 'Siparişlerim', icon: '📦', screen: 'Orders' },
  { id: '1', title: 'Profili Düzenle', icon: '👤', screen: 'EditProfile' },
  { id: '4', title: 'Adresler', icon: '📍', screen: 'Addresses' },
  { id: '6', title: 'Ayarlar', icon: '⚙️', screen: 'Settings' },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshProfile, isLoading } = useAuth();

  // Ekran açıldığında profili API'den tazele
  useEffect(() => {
    refreshProfile();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Onboarding');
  };

  // Kullanıcı adı ve soyadını birleştir
  const displayName = user
    ? `${user.ad || ''} ${user.soyad || ''}`.trim()
    : 'Kullanıcı';

  const displayEmail = user?.email || '';

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* ─── Header ─── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>❮</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>YEMEKİMNERDE</Text>
        
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.headerIconBag}>🛍️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* ─── User Profile Card ─── */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {user?.ad ? user.ad.charAt(0).toUpperCase() : '?'}
              </Text>
            </View>
          </View>
          <View style={styles.userInfo}>
            {isLoading ? (
              <ActivityIndicator color="#00e676" />
            ) : (
              <>
                <Text style={styles.userName}>{displayName}</Text>
                <Text style={styles.userEmail}>{displayEmail}</Text>
              </>
            )}
          </View>
        </View>

        {/* ─── Settings List ─── */}
        <View style={styles.listContainer}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.listItem,
                index === MENU_ITEMS.length - 1 && styles.lastListItem
              ]}
              onPress={() => item.screen ? navigation.navigate(item.screen) : null}
              activeOpacity={0.7}
            >
              <View style={styles.listItemLeft}>
                <Text style={styles.listIcon}>{item.icon}</Text>
                <Text style={styles.listTitle}>{item.title}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          
          {/* Logout Button */}
          <TouchableOpacity 
            style={[styles.listItem, styles.lastListItem]}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <View style={styles.listItemLeft}>
              <Text style={styles.listIconLogout}>🚪</Text>
              <Text style={styles.listTitleLogout}>Çıkış Yap</Text>
            </View>
            <Text style={styles.chevronLogout}>›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerBtn: {
    padding: 8,
  },
  headerIcon: {
    color: '#00e676',
    fontSize: 28,
  },
  headerIconBag: {
    fontSize: 24,
  },
  headerTitle: {
    color: '#00e676',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 2.5,
  },
  scrollContent: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginRight: 16,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#00e676',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#000000',
    fontSize: 36,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userName: {
    color: '#E2E2E2',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userEmail: {
    color: '#A0A0A0',
    fontSize: 16,
  },
  listContainer: {
    backgroundColor: '#121212',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  lastListItem: {
    borderBottomWidth: 0,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listIcon: {
    fontSize: 20,
    marginRight: 16,
    opacity: 0.7,
  },
  listTitle: {
    color: '#E2E2E2',
    fontSize: 18,
    fontWeight: '500',
  },
  chevron: {
    color: '#A0A0A0',
    fontSize: 24,
    fontWeight: '300',
  },
  listIconLogout: {
    fontSize: 20,
    marginRight: 16,
  },
  listTitleLogout: {
    color: '#ffb4ab',
    fontSize: 18,
    fontWeight: '400',
  },
  chevronLogout: {
    color: '#ffb4ab',
    fontSize: 24,
    fontWeight: '300',
  },
});

export default ProfileScreen;
