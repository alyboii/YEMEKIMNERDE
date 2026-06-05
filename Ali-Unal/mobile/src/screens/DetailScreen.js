// ─────────────────────────────────────────────
// Ürün Detay Ekranı — Stitch Design (Uber Style)
// Yemekim Nerede - Neon Green Dark Mode
// ─────────────────────────────────────────────

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import COLORS from '../theme/colors';
import TYPOGRAPHY from '../theme/typography';
import SPACING from '../theme/spacing';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DetailScreen = ({ route, navigation }) => {
  const [quantity, setQuantity] = useState(2);
  const [isExpanded, setIsExpanded] = useState(false);

  // Gelen veriyi kullan veya varsayılanı göster
  const item = route.params?.item || {
    id: '1',
    title: 'Cheese Burger',
    location: 'Naperville, Illinois',
    desc: 'A juicy cheeseburger with a perfectly grilled beef patty, melted cheddar cheese, fresh lettuce, tomatoes, and pickles, all stacked on a toasted sesame seed bun. The ultimate comfort food experience.',
    price: 16.00,
    rating: '4.9',
    time: '25-30 min',
    calories: '124 Kcal',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ═══ Hero Image Area ═══ */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.heroImage} />
          {/* Gradient Overlay for Top Header */}
          <View style={styles.imageOverlay} />
        </View>

        {/* ═══ Top Navigation (Absolute) ═══ */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Text style={styles.headerIcon}>❮</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detail</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Text style={styles.headerIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* ═══ Product Details ═══ */}
        <View style={styles.detailsContainer}>
          
          {/* Title & Quantity Row */}
          <View style={styles.titleRow}>
            <View style={styles.titleCol}>
              <Text style={styles.title}>{item.title}</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{item.location || 'Naperville, Illinois'}</Text>
              </View>
            </View>

            {/* Stepper */}
            <View style={styles.stepperContainer}>
              <TouchableOpacity
                style={styles.stepperBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Text style={styles.stepperBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{quantity}</Text>
              <TouchableOpacity
                style={[styles.stepperBtn, styles.stepperBtnAdd]}
                onPress={() => setQuantity(quantity + 1)}
              >
                <Text style={styles.stepperBtnAddText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Meta Badges */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⭐</Text>
              <Text style={styles.metaTextBold}>{item.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>⏱️</Text>
              <Text style={styles.metaText}>{item.time || '25-30 min'}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>🔥</Text>
              <Text style={styles.metaText}>{item.calories || '124 Kcal'}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descContainer}>
            <Text style={styles.description}>
              {isExpanded ? item.desc : `${item.desc.substring(0, 100)}...`}
              <Text style={styles.showMore} onPress={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? ' Show less' : ' Show more'}
              </Text>
            </Text>
          </View>

          {/* Customize Link */}
          <TouchableOpacity style={styles.customizeBtn}>
            <Text style={styles.customizeText}>Customize</Text>
            <Text style={styles.customizeArrow}>❯</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ═══ Floating Action Footer ═══ */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total amount</Text>
          <Text style={styles.priceValue}>${(item.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartBtn}>
          <Text style={styles.addToCartText}>Add to cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120, // Leave space for footer
  },
  
  // ─── Hero Image ───
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH, // Aspect Square
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    height: 120,
  },

  // ─── Header (Absolute) ───
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  headerTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },

  // ─── Details Section ───
  detailsContainer: {
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.xl,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.h2,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationIcon: {
    fontSize: 14,
  },
  locationText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  
  // Stepper
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  stepperBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperBtnText: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
  stepperValue: {
    width: 32,
    textAlign: 'center',
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  stepperBtnAdd: {
    backgroundColor: COLORS.surfaceBright,
  },
  stepperBtnAddText: {
    fontSize: 18,
    color: COLORS.textPrimary,
  },

  // Meta Badges
  metaContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaIcon: {
    fontSize: 16,
  },
  metaTextBold: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  metaText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },

  // Description
  descContainer: {
    marginBottom: SPACING.lg,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  showMore: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
  },

  // Customize Link
  customizeBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceContainer,
    padding: SPACING.md,
    borderRadius: SPACING.radiusMd,
  },
  customizeText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  customizeArrow: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // ─── Footer ───
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(18,18,18,0.95)', // background with opacity
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: 30, // For safe area
  },
  priceContainer: {
    flexDirection: 'column',
  },
  priceLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  addToCartBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 999,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addToCartText: {
    ...TYPOGRAPHY.h4,
    color: '#000000', // Pitch black text for contrast
  },
});

export default DetailScreen;
