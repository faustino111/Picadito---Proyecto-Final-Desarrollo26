import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Pressable,
  Linking,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from '../components/CustomButton';
import { CustomModal } from '../components/CustomModal';
import { useAuth } from '../context/AuthContext';

export const CanchaDetailScreen = ({ route, navigation }) => {
  const insets = useSafeAreaInsets();
  const { cancha } = route.params;
  const { addTurno } = useAuth();
  const [modalReservaVisible, setModalReservaVisible] = useState(false);

  // Función para abrir llamado telefónico directo
  const handleCallOwner = () => {
    if (!cancha.duenoTelefono) return;
    const phoneUrl = `tel:${cancha.duenoTelefono}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Teléfono', `Número del dueño: ${cancha.duenoTelefono}`);
        }
      })
      .catch(() => {
        Alert.alert('Teléfono', `Número del dueño: ${cancha.duenoTelefono}`);
      });
  };

  // Función para abrir WhatsApp directo
  const handleWhatsAppOwner = () => {
    if (!cancha.duenoTelefono) return;
    const cleanNumber = cancha.duenoTelefono.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `¡Hola ${cancha.duenoNombre}! Te escribo desde Picadito! para consultar disponibilidad de la cancha "${cancha.nombre}".`
    );
    const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;
    Linking.openURL(waUrl).catch(() => {
      Alert.alert(
        'WhatsApp',
        `No se pudo abrir WhatsApp. Contacto: ${cancha.duenoTelefono}`
      );
    });
  };

  const handleConfirmReservation = async () => {
    setModalReservaVisible(false);
    await addTurno({
      canchaId: cancha.id,
      canchaNombre: cancha.nombre,
      canchaImagen: cancha.imagen,
      canchaDireccion: cancha.direccion,
      canchaBarrio: cancha.barrio,
      canchaTipo: cancha.tipo,
      canchaPrecio: cancha.precio,
      canchaHorario: cancha.horario,
      canchaDueno: cancha.duenoNombre,
      canchaTelefono: cancha.duenoTelefono,
    });
    Alert.alert(
      '¡Turno Reservado con Éxito! ⚽',
      `El turno para "${cancha.nombre}" quedó guardado en tu sección de Turnos.`,
      [
        {
          text: 'Ver Mis Turnos',
          onPress: () => navigation.navigate('Turnos'),
        },
        { text: 'Aceptar', style: 'default' },
      ]
    );
  };

  // Renderizar servicios disponibles usando un ciclo for tradicional
  const renderServiciosBadges = () => {
    const badges = [];
    if (cancha.servicios && cancha.servicios.length > 0) {
      for (let i = 0; i < cancha.servicios.length; i++) {
        const item = cancha.servicios[i];
        badges.push(
          <View key={`serv-${i}`} style={styles.servicePill}>
            <Ionicons name="checkmark-circle" size={16} color="#16a34a" />
            <Text style={styles.servicePillText}>{item}</Text>
          </View>
        );
      }
    }
    return badges;
  };

  return (
    <View style={styles.screenContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Imagen Principal con Botón Volver (Stack) */}
        <View style={styles.imageHeaderContainer}>
          <Image
            source={{ uri: cancha.imagen }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          {/* Botón Volver del Stack */}
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backCircleBtn,
              {
                top:
                  Platform.OS === 'android'
                    ? (StatusBar.currentHeight || 0) + 12
                    : Math.max(insets.top, 16) + 6,
              },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="arrow-back" size={22} color="#0f172a" />
          </Pressable>

          {/* Badge del tipo de cancha */}
          <View
            style={[
              styles.tipoBadge,
              {
                top:
                  Platform.OS === 'android'
                    ? (StatusBar.currentHeight || 0) + 16
                    : Math.max(insets.top, 16) + 10,
              },
            ]}
          >
            <Text style={styles.tipoBadgeText}>{cancha.tipo}</Text>
          </View>
        </View>

        {/* Cuerpo de Contenido */}
        <View style={styles.contentBody}>
          {/* Título y Precio */}
          <View style={styles.titlePriceRow}>
            <View style={styles.titleCol}>
              <Text style={styles.canchaTitle}>{cancha.nombre}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#eab308" />
                <Text style={styles.ratingVal}>{cancha.calificacion}</Text>
                <Text style={styles.reviewsText}>
                  ({cancha.opiniones} opiniones)
                </Text>
              </View>
            </View>
            <View style={styles.priceCol}>
              <Text style={styles.priceNum}>
                ${Number(cancha.precio).toLocaleString('es-AR')}
              </Text>
              <Text style={styles.priceSub}>por hora</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* 1. ESPECIFICACIÓN: Para cuántos jugadores es */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="people" size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Capacidad y Superficie</Text>
            </View>
            <View style={styles.specItemRow}>
              <Text style={styles.specLabel}>Jugadores:</Text>
              <Text style={styles.specValue}>{cancha.jugadores}</Text>
            </View>
            <View style={styles.specItemRow}>
              <Text style={styles.specLabel}>Tipo de césped:</Text>
              <Text style={styles.specValue}>{cancha.superficie}</Text>
            </View>
            <View style={styles.specItemRow}>
              <Text style={styles.specLabel}>Techada:</Text>
              <Text style={styles.specValue}>
                {cancha.techada ? 'Sí, protegida de lluvia' : 'Al aire libre'}
              </Text>
            </View>
          </View>

          {/* 2. ESPECIFICACIÓN: Ubicación */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="location" size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Ubicación</Text>
            </View>
            <Text style={styles.addressMain}>{cancha.direccion}</Text>
            <Text style={styles.addressSub}>{cancha.barrio}</Text>
            <Pressable
              onPress={() => navigation.navigate('Mapa')}
              style={({ pressed }) => [
                styles.verMapaBtn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name="map-outline" size={18} color="#16a34a" />
              <Text style={styles.verMapaBtnText}>Ver en Mapa Interactivo</Text>
            </Pressable>
          </View>

          {/* 3. ESPECIFICACIÓN: Horario de atención */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Horario de Atención</Text>
            </View>
            <Text style={styles.hoursText}>{cancha.horario}</Text>
            <Text style={styles.hoursSub}>
              Turnos disponibles de 60 o 90 minutos con luz nocturna.
            </Text>
          </View>

          {/* 4. ESPECIFICACIÓN: Contacto del dueño */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="person-circle" size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Contacto del Dueño</Text>
            </View>
            <Text style={styles.ownerName}>{cancha.duenoNombre}</Text>
            <Text style={styles.ownerPhone}>Tel: {cancha.duenoTelefono}</Text>

            {/* Botones de contacto directo (WhatsApp y Llamada) */}
            <View style={styles.contactButtonsRow}>
              <Pressable
                onPress={handleWhatsAppOwner}
                style={({ pressed }) => [
                  styles.contactActionBtn,
                  { backgroundColor: '#25D366' },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#ffffff" />
                <Text style={styles.contactBtnText}>WhatsApp</Text>
              </Pressable>

              <Pressable
                onPress={handleCallOwner}
                style={({ pressed }) => [
                  styles.contactActionBtn,
                  { backgroundColor: '#0284c7' },
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name="call" size={18} color="#ffffff" />
                <Text style={styles.contactBtnText}>Llamar</Text>
              </Pressable>
            </View>
          </View>

          {/* Servicios y comodidades */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark" size={20} color="#16a34a" />
              <Text style={styles.sectionTitle}>Servicios Incluidos</Text>
            </View>
            <View style={styles.servicesGrid}>{renderServiciosBadges()}</View>
          </View>

          {/* Descripción */}
          <View style={styles.sectionCard}>
            <Text style={styles.descTitle}>Sobre este complejo</Text>
            <Text style={styles.descContent}>{cancha.descripcion}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Barra Inferior con Botón de Reserva */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom, 14),
          },
        ]}
      >
        <View>
          <Text style={styles.bottomPriceLabel}>Total alquiler:</Text>
          <Text style={styles.bottomPriceVal}>
            ${Number(cancha.precio).toLocaleString('es-AR')}{' '}
            <Text style={styles.bottomPricePer}>/ hs</Text>
          </Text>
        </View>

        <CustomButton
          title="Reservar Turno"
          iconName="calendar-outline"
          onPress={() => setModalReservaVisible(true)}
          style={styles.reserveBtn}
        />
      </View>

      {/* Modal Reutilizable de confirmación con imagen */}
      <CustomModal
        visible={modalReservaVisible}
        onClose={() => setModalReservaVisible(false)}
        title="Confirmar Reserva"
        imageUri={cancha.imagen}
        subtitle={`Vas a solicitar la reserva de ${cancha.nombre}`}
        confirmText="Confirmar y Enviar"
        confirmIcon="checkmark-done"
        onConfirm={handleConfirmReservation}
      >
        <View style={styles.modalReservationInfo}>
          <Text style={styles.modalResDetail}>
            📍 <Text style={styles.boldText}>Lugar:</Text> {cancha.direccion}
          </Text>
          <Text style={styles.modalResDetail}>
            ⚽ <Text style={styles.boldText}>Modalidad:</Text> {cancha.tipo} (
            {cancha.jugadores})
          </Text>
          <Text style={styles.modalResDetail}>
            🕒 <Text style={styles.boldText}>Horarios:</Text> {cancha.horario}
          </Text>
          <Text style={styles.modalResDetail}>
            👤 <Text style={styles.boldText}>Dueño:</Text> {cancha.duenoNombre} (
            {cancha.duenoTelefono})
          </Text>
          <View style={styles.modalNote}>
            <Text style={styles.modalNoteText}>
              Se enviará una notificación a Picadito! y al encargado del predio.
            </Text>
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageHeaderContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#000',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backCircleBtn: {
    position: 'absolute',
    top: 48,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  tipoBadge: {
    position: 'absolute',
    bottom: 16,
    right: 18,
    backgroundColor: '#16a34a',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tipoBadgeText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  contentBody: {
    padding: 20,
    paddingBottom: 110,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleCol: {
    flex: 1,
    marginRight: 12,
  },
  canchaTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#854d0e',
    marginLeft: 4,
  },
  reviewsText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  priceCol: {
    alignItems: 'flex-end',
  },
  priceNum: {
    fontSize: 22,
    fontWeight: '900',
    color: '#16a34a',
  },
  priceSub: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 18,
  },
  sectionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 8,
  },
  specItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  specLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  addressMain: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  addressSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  verMapaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  verMapaBtnText: {
    marginLeft: 6,
    color: '#16a34a',
    fontWeight: '700',
    fontSize: 13,
  },
  hoursText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  hoursSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  ownerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  ownerPhone: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  contactButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  contactActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  contactBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 6,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  servicePillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 5,
  },
  descTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  descContent: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPriceLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  bottomPriceVal: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0f172a',
  },
  bottomPricePer: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
  },
  reserveBtn: {
    minWidth: 170,
    marginVertical: 0,
  },
  modalReservationInfo: {
    gap: 10,
    paddingVertical: 4,
  },
  modalResDetail: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '700',
  },
  modalNote: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  modalNoteText: {
    fontSize: 12,
    color: '#15803d',
    textAlign: 'center',
  },
});
