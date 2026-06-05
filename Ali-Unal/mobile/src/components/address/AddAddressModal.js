import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Input from '../common/Input';
import Button from '../common/Button';
import COLORS from '../../theme/colors';
import TYPOGRAPHY from '../../theme/typography';
import SPACING from '../../theme/spacing';

const AddAddressModal = ({ visible, onClose, onAdd }) => {
  const [baslik, setBaslik] = useState('');
  const [sehir, setSehir] = useState('');
  const [adres, setAdres] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!baslik || !sehir || !adres) return;
    setIsSubmitting(true);
    await onAdd({ baslik, sehir, adres });
    setIsSubmitting(false);
    setBaslik('');
    setSehir('');
    setAdres('');
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Yeni Adres Ekle</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <Input
              label="Adres Başlığı"
              placeholder="Ev, İş vb."
              value={baslik}
              onChangeText={setBaslik}
              editable={!isSubmitting}
            />
            <Input
              label="Şehir"
              placeholder="Örn: İstanbul"
              value={sehir}
              onChangeText={setSehir}
              editable={!isSubmitting}
            />
            <Input
              label="Açık Adres"
              placeholder="Mahalle, sokak, no..."
              value={adres}
              onChangeText={setAdres}
              editable={!isSubmitting}
              multiline
            />
          </View>

          <Button
            title="Adresi Kaydet"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={!baslik || !sehir || !adres}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: SPACING.radiusLg,
    borderTopRightRadius: SPACING.radiusLg,
    padding: SPACING.lg,
    paddingBottom: Platform.OS === 'ios' ? SPACING.xxl : SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.h3,
    color: COLORS.textPrimary,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  closeIcon: {
    fontSize: 20,
    color: COLORS.textSecondary,
  },
  form: {
    marginBottom: SPACING.lg,
  },
});

export default AddAddressModal;
