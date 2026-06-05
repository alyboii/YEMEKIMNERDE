import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

const PaymentsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PAYMENT METHODS</Text>
        <View style={styles.headerBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionTitle}>SAVED CARDS</Text>
        
        <View style={[styles.cardItem, styles.cardItemSelected]}>
          <View style={styles.cardInfo}>
            <View style={styles.cardIconBox}><Text style={styles.cardIconText}>VISA</Text></View>
            <View>
              <Text style={styles.cardNumber}>•••• •••• •••• 4242</Text>
              <Text style={styles.cardExpiry}>Expires 12/26</Text>
            </View>
          </View>
          <View style={styles.checkCircle}><Text style={styles.checkMark}>✓</Text></View>
        </View>

        <View style={styles.cardItem}>
          <View style={styles.cardInfo}>
            <View style={styles.cardIconBox}><Text style={styles.cardIconText}>MC</Text></View>
            <View>
              <Text style={styles.cardNumber}>•••• •••• •••• 5555</Text>
              <Text style={styles.cardExpiry}>Expires 08/25</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.9}>
          <Text style={styles.addBtnText}>+ ADD NEW CARD</Text>
        </TouchableOpacity>
      </View>
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
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: { color: '#bacbb9', fontSize: 13, fontWeight: '700', letterSpacing: 2, marginBottom: 16 },
  
  cardItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1f1f1f', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: '#2C2C2C' },
  cardItemSelected: { borderColor: '#00E676', backgroundColor: 'rgba(0, 230, 118, 0.05)' },
  cardInfo: { flexDirection: 'row', alignItems: 'center' },
  cardIconBox: { width: 50, height: 32, backgroundColor: '#121212', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: '#353535' },
  cardIconText: { color: '#e2e2e2', fontSize: 12, fontWeight: '900' },
  cardNumber: { color: '#e2e2e2', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  cardExpiry: { color: '#A0A0A0', fontSize: 13 },
  
  checkCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#00E676', justifyContent: 'center', alignItems: 'center' },
  checkMark: { color: '#000', fontSize: 14, fontWeight: '900' },

  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'rgba(0,0,0,0.8)' },
  addBtn: { backgroundColor: '#1f1f1f', paddingVertical: 20, borderRadius: 999, alignItems: 'center', borderWidth: 1, borderColor: '#00E676' },
  addBtnText: { color: '#00E676', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});

export default PaymentsScreen;
