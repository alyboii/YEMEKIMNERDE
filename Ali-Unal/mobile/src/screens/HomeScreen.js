// ─────────────────────────────────────────────
// Ana Sayfa — Stitch Design (Uber Style)
// Yemekim Nerede - Neon Green Dark Mode
// ─────────────────────────────────────────────

import React from 'react';
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

// ─── Dummy Data ───
const CATEGORIES = ['All Type', 'Sashimi', 'Nigiri', 'Temaki', 'Maki'];
const POPULAR_ITEMS = [
  {
    id: '1',
    title: 'Nigiri Sushi',
    desc: 'Fresh assorted fish on vinegared rice.',
    price: '$22.00',
    rating: '4.8',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=600&auto=format&fit=crop',
    active: false,
  },
  {
    id: '2',
    title: 'Grilled Steak',
    desc: 'Premium beef topped with rich herb butter and green onions.',
    price: '$35.00',
    rating: '5.0',
    image: 'https://images.unsplash.com/photo-1546833998-877b37c2e5c6?q=80&w=600&auto=format&fit=crop',
    active: true,
  },
  {
    id: '3',
    title: 'Chicken Bowl',
    desc: 'Small rice bowl topped with savory chicken and veggies.',
    price: '$25.00',
    rating: '4.9',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?q=80&w=600&auto=format&fit=crop',
    active: false,
  },
];
const BEST_CHOICE = [
  {
    id: '1',
    title: 'Pan Grilled Bratwurst',
    desc: 'Protein-50gm, Carbs-10gm, Fats-15gm (The perfect post-workout meal).',
    price: '$18.50',
    calories: '320 Kcal',
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&auto=format&fit=crop',
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ═══ Header ═══ */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.locationContainer}>
          <Text style={styles.locationLabel}>LOCATION</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Naperville, Illinois</Text>
            <Text style={styles.locationArrow}>▼</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.headerIcon}>🔔</Text>
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* ═══ Promo Banner ═══ */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <View style={styles.promoCodeRow}>
              <Text style={styles.promoCodeLabel}>USE CODE</Text>
              <View style={styles.promoCodeBadge}>
                <Text style={styles.promoCodeText}>FIRST50</Text>
              </View>
            </View>
            <Text style={styles.promoTitle}>Get 50% Off Your{'\n'}First Order!</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=600&auto=format&fit=crop' }}
            style={styles.promoImage}
          />
        </View>

        {/* ═══ Category Pills ═══ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll} contentContainerStyle={styles.categoryContainer}>
          {CATEGORIES.map((cat, index) => (
            <TouchableOpacity key={cat} style={[styles.categoryPill, index === 0 && styles.categoryPillActive]}>
              <Text style={[styles.categoryPillText, index === 0 && styles.categoryPillTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ═══ Horizontal Cards (Popular) ═══ */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll} contentContainerStyle={styles.popularContainer}>
          {POPULAR_ITEMS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.popularCard, item.active && styles.popularCardActive]}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Detail', { item })}
            >
              <View style={styles.ratingBadge}>
                <Text style={styles.ratingIcon}>⭐</Text>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
              
              <Image source={{ uri: item.image }} style={[styles.popularImage, item.active && styles.popularImageActive]} />
              
              <Text style={[styles.popularTitle, item.active && styles.popularTitleActive]} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.popularDesc} numberOfLines={2}>{item.desc}</Text>
              
              <View style={styles.popularFooter}>
                <Text style={styles.popularPrice}>{item.price}</Text>
                <TouchableOpacity style={[styles.addBtn, item.active && styles.addBtnActive]}>
                  <Text style={[styles.addBtnText, item.active && styles.addBtnTextActive]}>+</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ═══ Best Choice (Vertical) ═══ */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Choice</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all ❯</Text>
          </TouchableOpacity>
        </View>

        {BEST_CHOICE.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.bestChoiceCard} 
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Detail', { item })}
          >
            <View style={styles.bestChoiceInfo}>
              <Text style={styles.bestChoiceTitle}>{item.title}</Text>
              <Text style={styles.bestChoiceDesc} numberOfLines={2}>{item.desc}</Text>
              
              <View style={styles.bestChoiceFooter}>
                <Text style={styles.bestChoicePrice}>{item.price}</Text>
                <View style={styles.calorieBadge}>
                  <Text style={styles.calorieIcon}>🔥</Text>
                  <Text style={styles.calorieText}>{item.calories}</Text>
                </View>
              </View>
            </View>
            <Image source={{ uri: item.image }} style={styles.bestChoiceImage} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xxxl,
  },
  
  // ─── Header ───
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: 'rgba(18,18,18,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    zIndex: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 20,
    color: COLORS.textPrimary,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 1,
    marginBottom: 2,
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
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
  },
  locationArrow: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginLeft: 2,
  },

  // ─── Promo Banner ───
  promoBanner: {
    marginHorizontal: SPACING.screenPadding,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoCodeLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(0,0,0,0.6)',
    letterSpacing: 1.5,
  },
  promoCodeBadge: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  promoCodeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
  promoTitle: {
    ...TYPOGRAPHY.h3,
    color: '#000000',
    fontWeight: '800',
  },
  promoImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    transform: [{ rotate: '12deg' }],
  },

  // ─── Category Pills ───
  categoryScroll: {
    marginTop: SPACING.lg,
  },
  categoryContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.sm,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: COLORS.surfaceContainer,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  categoryPillActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryPillText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  categoryPillTextActive: {
    color: '#000000',
  },

  // ─── Horizontal Popular Cards ───
  popularScroll: {
    marginTop: SPACING.xxxl,
  },
  popularContainer: {
    paddingHorizontal: SPACING.screenPadding,
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  popularCard: {
    width: 160,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  popularCardActive: {
    backgroundColor: COLORS.surfaceContainerHigh,
    borderColor: 'rgba(0,230,118,0.3)',
    transform: [{ translateY: -10 }],
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
    gap: 4,
  },
  ratingIcon: {
    fontSize: 10,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  popularImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignSelf: 'center',
    marginTop: -40,
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.surfaceContainer,
  },
  popularImageActive: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginTop: -50,
    borderColor: COLORS.surfaceContainerHigh,
  },
  popularTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  popularTitleActive: {
    color: COLORS.primary,
    fontSize: 16,
  },
  popularDesc: {
    fontSize: 10,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
    height: 28,
  },
  popularFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: SPACING.sm,
  },
  popularPrice: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnActive: {
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  addBtnText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  addBtnTextActive: {
    color: '#000',
    fontSize: 18,
  },

  // ─── Best Choice (Vertical) ───
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.screenPadding,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  seeAllText: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
  },
  bestChoiceCard: {
    flexDirection: 'row',
    marginHorizontal: SPACING.screenPadding,
    backgroundColor: COLORS.surfaceContainer,
    borderRadius: 24,
    padding: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  bestChoiceInfo: {
    flex: 1,
    padding: SPACING.sm,
    justifyContent: 'space-between',
  },
  bestChoiceTitle: {
    ...TYPOGRAPHY.label,
    color: COLORS.primary,
    marginBottom: 4,
    fontSize: 16,
  },
  bestChoiceDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  bestChoiceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  bestChoicePrice: {
    ...TYPOGRAPHY.label,
    color: COLORS.textPrimary,
    fontSize: 16,
  },
  calorieBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    gap: 4,
  },
  calorieIcon: {
    fontSize: 10,
  },
  calorieText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  bestChoiceImage: {
    width: 96,
    height: 96,
    borderRadius: 16,
  },
});

export default HomeScreen;
