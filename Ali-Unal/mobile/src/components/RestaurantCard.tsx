import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Restaurant } from '../services/restaurantService';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onPress }) => {
  const isClosed = !restaurant.aktif;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.9}
      disabled={isClosed}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: restaurant.gorselUrl }} style={styles.image} />
        {isClosed && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>KAPALI</Text>
          </View>
        )}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingIcon}>⭐</Text>
          <Text style={styles.ratingText}>{restaurant.puan.toFixed(1)}</Text>
        </View>
      </View>
      
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{restaurant.ad}</Text>
          <Text style={styles.distanceBadge}>{restaurant.distance} km</Text>
        </View>
        
        <Text style={styles.cuisine}>{restaurant.mutfakTuru}</Text>
        
        <View style={styles.footer}>
          <View style={styles.detailRow}>
            <Text style={styles.icon}>⏱</Text>
            <Text style={styles.detailText}>{restaurant.teslimatSuresi} dk</Text>
          </View>
          
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>Öneri Puanı: {restaurant.personalScore.toFixed(0)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E1E1E', // Koyu tema uyumlu arkaplan
    borderRadius: 24,
    marginBottom: 20,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 3,
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  ratingIcon: {
    fontSize: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  info: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
  },
  distanceBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00E676', // Neon yeşil detay
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 8,
  },
  cuisine: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  detailText: {
    fontSize: 14,
    color: '#E0E0E0',
    fontWeight: '500',
  },
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    color: '#BBBBBB',
    fontWeight: '600',
  }
});

export default RestaurantCard;
