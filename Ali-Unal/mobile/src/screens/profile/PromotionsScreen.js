import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView, TextInput } from 'react-native';

const PromotionsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PROMOTIONS</Text>
        <View style={styles.headerBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.input} 
            placeholder="ENTER PROMO CODE" 
            placeholderTextColor="#A0A0A0"
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>APPLY</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>ACTIVE COUPONS</Text>
        
        <View style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoAmount}>20% OFF</Text>
            <Text style={styles.promoDesc}>On your next 3 orders</Text>
            <Text style={styles.promoExpiry}>Expires in 2 days</Text>
          </View>
          <TouchableOpacity style={styles.useBtn}>
            <Text style={styles.useBtnText}>USE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.promoCard}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoAmount}>FREE DELIVERY</Text>
            <Text style={styles.promoDesc}>Valid for orders over $30</Text>
            <Text style={styles.promoExpiry}>Expires in 5 days</Text>
          </View>
          <TouchableOpacity style={styles.useBtn}>
            <Text style={styles.useBtnText}>USE</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, height: 64, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  headerBtn: { padding: 8, width: 48, alignItems: 'flex-start' },
  headerBtnSpacer: { width: 48 },
  headerIcon: { color: '#e2e2e2', fontSize: 24 },
  headerTitle: { color: '#A0A0A0', fontSize: 18, fontWeight: '800', letterSpacing: 2 },
  content: { padding: 20 },
  
  inputContainer: { flexDirection: 'row', marginBottom: 32 },
  input: { flex: 1, backgroundColor: '#1f1f1f', borderTopLeftRadius: 12, borderBottomLeftRadius: 12, paddingHorizontal: 20, color: '#e2e2e2', fontSize: 16, borderWidth: 1, borderColor: '#2C2C2C', borderRightWidth: 0 },
  applyBtn: { backgroundColor: '#00E676', paddingHorizontal: 24, justifyContent: 'center', borderTopRightRadius: 12, borderBottomRightRadius: 12 },
  applyBtnText: { color: '#000000', fontWeight: '800', fontSize: 14, letterSpacing: 1 },

  sectionTitle: { color: '#bacbb9', fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 16 },
  
  promoCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f1f1f', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2C2C2C', borderLeftWidth: 4, borderLeftColor: '#00E676' },
  promoLeft: { flex: 1 },
  promoAmount: { color: '#00E676', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  promoDesc: { color: '#e2e2e2', fontSize: 14, marginBottom: 8 },
  promoExpiry: { color: '#A0A0A0', fontSize: 12 },
  
  useBtn: { backgroundColor: '#2a2a2a', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: '#353535' },
  useBtnText: { color: '#e2e2e2', fontSize: 12, fontWeight: '700' },
});

export default PromotionsScreen;
