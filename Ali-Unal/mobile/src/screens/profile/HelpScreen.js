import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, ScrollView } from 'react-native';

const HelpScreen = ({ navigation }) => {
  const faqs = [
    { q: 'Where is my order?', a: 'You can track your order in real-time from the Home screen once it is placed.' },
    { q: 'How do I request a refund?', a: 'Go to your past orders, select the issue, and tap "Request Refund".' },
    { q: 'Can I change my delivery address?', a: 'Yes, but only before the restaurant accepts the order.' },
  ];

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>HELP & SUPPORT</Text>
        <View style={styles.headerBtnSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <Text style={styles.sectionTitle}>FREQUENTLY ASKED QUESTIONS</Text>
        
        {faqs.map((faq, index) => (
          <TouchableOpacity key={index} style={styles.faqItem} activeOpacity={0.7}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.q}</Text>
              <Text style={styles.plusIcon}>+</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.supportBox}>
          <Text style={styles.supportIcon}>💬</Text>
          <Text style={styles.supportTitle}>Still need help?</Text>
          <Text style={styles.supportDesc}>Our support team is available 24/7 to assist you.</Text>
        </View>

      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.chatBtn} activeOpacity={0.9}>
          <Text style={styles.chatBtnText}>START LIVE CHAT</Text>
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
  faqItem: { backgroundColor: '#1f1f1f', padding: 20, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#2C2C2C' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { color: '#e2e2e2', fontSize: 16, fontWeight: '600', flex: 1 },
  plusIcon: { color: '#00E676', fontSize: 24, fontWeight: '300' },
  
  supportBox: { marginTop: 32, alignItems: 'center', padding: 24, backgroundColor: '#121212', borderRadius: 16, borderWidth: 1, borderColor: '#2C2C2C' },
  supportIcon: { fontSize: 40, marginBottom: 16 },
  supportTitle: { color: '#e2e2e2', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  supportDesc: { color: '#A0A0A0', fontSize: 14, textAlign: 'center', lineHeight: 22 },

  bottomContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, backgroundColor: 'rgba(0,0,0,0.8)' },
  chatBtn: { backgroundColor: '#00E676', paddingVertical: 20, borderRadius: 999, alignItems: 'center' },
  chatBtnText: { color: '#000000', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});

export default HelpScreen;
