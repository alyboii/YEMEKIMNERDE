// ─────────────────────────────────────────────
// Onboarding Ekranı (Splash)
// Görsel 1 ile birebir uyumlu
// ─────────────────────────────────────────────

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ImageBackground,
  Animated,
  PanResponder,
} from 'react-native';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BUTTON_WIDTH = Math.min(SCREEN_WIDTH - 48, 320);
const CIRCLE_SIZE = 56;
const PADDING = 8;
const MAX_SWIPE = BUTTON_WIDTH - CIRCLE_SIZE - PADDING * 2;

const OnboardingScreen = ({ navigation }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove: (e, gesture) => {
        // Clamp the drag between 0 and MAX_SWIPE
        let newX = gesture.dx;
        if (newX < 0) newX = 0;
        if (newX > MAX_SWIPE) newX = MAX_SWIPE;
        pan.setValue({ x: newX, y: 0 });
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > MAX_SWIPE * 0.75) {
          // Snap to end and navigate
          Animated.spring(pan, {
            toValue: { x: MAX_SWIPE, y: 0 },
            useNativeDriver: false,
          }).start(() => {
            navigation.replace('Login');
          });
        } else {
          // Snap back to start
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#00E676" />
      
      {/* ─── Top Green Section ─── */}
      <View style={styles.topSection}>
        <ImageBackground
          source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB835Fqf183aFCnW3R60VoJHgxVO3AUX90x1b0Gnr8fdJg36BXbcMLK8DEDO7kT_j-umr10qi6SB2-aX8Gn14NGrds-QoblPxqDuzrRVGu8x8BL72yZS_SwDA-Xg69s2QwUxP4z9YFsnJFM5C62SFWxkjW7Cg6mSIOhCD6qPcrq4Sx6EG-qJ-PNBVwy2p237B4m7mcT95Ozm0xKnwbHyQ1vrdU257EaMTF3nkuGsOtTfw0Zp6IbUv8VmqCQAaKcNn0wii6K-cX3eA' }}
          style={styles.patternBg}
          imageStyle={{ opacity: 0.15, resizeMode: 'repeat' }}
        >
          {/* Floating UI Elements from HTML */}
          <Text style={[styles.floatingIcon, { top: 80, left: 40, transform: [{rotate: '-12deg'}], fontSize: 64 }]}>🍔</Text>
          <Text style={[styles.floatingIcon, { top: 160, right: 48, transform: [{rotate: '12deg'}], fontSize: 48 }]}>🍕</Text>
          <Text style={[styles.floatingIcon, { top: 256, left: 64, transform: [{rotate: '-6deg'}], fontSize: 56 }]}>🍜</Text>
          <Text style={[styles.floatingIcon, { top: 40, right: 80, transform: [{rotate: '45deg'}], fontSize: 40 }]}>🍦</Text>
          <Text style={[styles.floatingIcon, { top: 320, right: 32, transform: [{rotate: '-15deg'}], fontSize: 50 }]}>🍟</Text>
        </ImageBackground>

        {/* Brand Badge */}
        <View style={styles.brandBadgeContainer}>
          <View style={styles.brandBadge}>
            <Text style={styles.brandText}>YEMEKİMNERDE</Text>
          </View>
        </View>
      </View>

      {/* ─── Curved Separator & Bottom Black Section ─── */}
      <View style={styles.bottomSection}>
        {/* Curve Effect */}
        <View style={styles.curveContainer}>
          <View style={styles.curve} />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.titleGreen}>Aç mısın?</Text>
          <Text style={styles.titleWhite}>Hızlıca Getir</Text>
          <Text style={styles.subtitle}>Taze, hızlı ve damak tadına uygun!</Text>
        </View>

        {/* Order Now Swipe Button */}
        <View style={styles.footer}>
          <View style={styles.orderButton}>
            <Text style={styles.orderTextAbs}>Şimdi Sipariş Ver</Text>
            <Text style={styles.arrowsTextAbs}>❯❯❯</Text>
            
            <Animated.View
              {...panResponder.panHandlers}
              style={[
                styles.iconCircle,
                {
                  transform: [{ translateX: pan.x }]
                }
              ]}
            >
              <Text style={styles.bagIcon}>🛍️</Text>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050505', // Pitch black void for base
  },
  topSection: {
    height: SCREEN_HEIGHT * 0.55,
    backgroundColor: '#00E676', // Bright Green
    position: 'relative',
    overflow: 'hidden',
  },
  patternBg: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  floatingIcon: {
    position: 'absolute',
    opacity: 0.3,
    color: '#000000',
  },
  brandBadgeContainer: {
    position: 'absolute',
    top: '45%',
    left: 0,
    width: '100%',
    alignItems: 'center',
    zIndex: 20,
  },
  brandBadge: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 24,
  },
  brandText: {
    color: '#e2e2e2',
    fontSize: 28,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -1,
  },
  
  bottomSection: {
    flex: 1,
    backgroundColor: '#050505', // Pitch black for bottom
    position: 'relative',
    marginTop: -SCREEN_HEIGHT * 0.1, // overlap
  },
  curveContainer: {
    position: 'absolute',
    top: -50,
    left: '-25%',
    width: '150%',
    height: 100,
    overflow: 'hidden',
  },
  curve: {
    width: '100%',
    height: '200%',
    borderRadius: SCREEN_WIDTH * 1.5,
    backgroundColor: '#050505',
    position: 'absolute',
    top: 0,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 80,
  },
  titleGreen: {
    color: '#00E676',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  titleWhite: {
    color: '#e2e2e2',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    color: '#c8c6c5',
    fontSize: 16,
    fontWeight: '400',
  },
  
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    alignItems: 'center',
  },
  orderButton: {
    width: BUTTON_WIDTH,
    height: CIRCLE_SIZE + PADDING * 2,
    backgroundColor: '#1f1f1f', // surface-container
    borderRadius: 999,
    padding: PADDING,
    borderWidth: 1,
    borderColor: '#353535',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
    justifyContent: 'center',
    position: 'relative',
  },
  orderTextAbs: {
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#e2e2e2',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    zIndex: 0,
  },
  arrowsTextAbs: {
    position: 'absolute',
    right: 24,
    color: '#bacbb9',
    opacity: 0.5,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 2,
    zIndex: 0,
  },
  iconCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: '#00E676',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  bagIcon: {
    fontSize: 24,
  },
});

export default OnboardingScreen;
