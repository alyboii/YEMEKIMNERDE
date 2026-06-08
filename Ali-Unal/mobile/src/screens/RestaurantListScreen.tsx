import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { useRestaurants } from '../hooks/useRestaurants';
import RestaurantCard from '../components/RestaurantCard';

const RestaurantListScreen: React.FC = () => {
  const { restaurants, loading, error, refetch } = useRestaurants(undefined, 10);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.centerBox}>
        <Text style={styles.emojiIcon}>🍽️</Text>
        <Text style={styles.centerText}>Şu anda uygun restoran bulunmamaktadır.</Text>
      </View>
    );
  };

  if (loading && !refreshing && restaurants.length === 0) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#00E676" />
          <Text style={styles.loadingText}>Restoranlar yükleniyor...</Text>
        </View>
      </View>
    );
  }

  if (error && restaurants.length === 0) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" backgroundColor="#121212" />
        <View style={styles.centerBox}>
          <Text style={styles.emojiIcon}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yakındaki Restoranlar</Text>
        <Text style={styles.headerSubtitle}>Senin için en uygun sonuçlar listeleniyor</Text>
      </View>

      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RestaurantCard 
            restaurant={item} 
            onPress={() => console.log('Restorana gidiliyor:', item.ad)} 
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#00E676"
            colors={['#00E676']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#121212', // Koyu tema arkaplanı
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(18,18,18,0.95)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#00E676', // Tema yeşili
  },
  listContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emojiIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#AAAAAA',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
    marginTop: 16,
  },
  centerText: {
    fontSize: 16,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});

export default RestaurantListScreen;
