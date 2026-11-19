import React from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from './CustomButton';

// Componente Reutilizable 3: Modal versátil para cargar información detallada e imágenes
export const CustomModal = ({
  visible,
  onClose,
  title,
  imageUri = null,
  subtitle = null,
  children = null,
  confirmText = 'Entendido',
  onConfirm = null,
  confirmIcon = 'checkmark-circle-outline',
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.modalCard}>
          {/* Header con botón de cierre */}
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { backgroundColor: '#f1f5f9' },
              ]}
              hitSlop={8}
            >
              <Ionicons name="close" size={22} color="#475569" />
            </Pressable>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Imagen opcional en el modal */}
            {imageUri ? (
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: imageUri }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
              </View>
            ) : null}

            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

            {/* Contenido dinámico inyectado */}
            {children}
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.footer}>
            <CustomButton
              title={confirmText}
              iconName={confirmIcon}
              onPress={onConfirm || onClose}
              style={styles.actionBtn}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
  },
  closeButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 20,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#e2e8f0',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionBtn: {
    marginVertical: 0,
  },
});
