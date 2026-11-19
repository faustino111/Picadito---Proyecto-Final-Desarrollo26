import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Componente Tarjeta de Cancha estilo Airbnb / Booking
export const CanchaCard = ({ cancha, onPress, onQuickInfoPress }) => {
  const getBadgeColor = (tipo) => {
    switch (tipo) {
      case 'Fútbol 5':
        return '#16a34a';
      case 'Fútbol 7':
        return '#0284c7';
      case 'Fútbol 9':
        return '#7c3aed';
      case 'Fútbol 11':
        return '#ea580c';
      default:
        return '#16a34a';
    }
  };

  const formattedPrice = Number(cancha.precio).toLocaleString('es-AR');

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          transform: [{ scale: pressed ? 0.985 : 1 }],
        },
      ]}
    >
      {/* Contenedor de Imagen Principal */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: cancha.imagen }}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Badge flotante tipo de cancha (F5, F7, F9, F11) */}
        <View
          style={[
            styles.typeBadge,
            { backgroundColor: getBadgeColor(cancha.tipo) },
          ]}
        >
          <Text style={styles.typeBadgeText}>{cancha.tipo}</Text>
        </View>

        {/* Botón rápido modal info */}
        {onQuickInfoPress ? (
          <Pressable
            onPress={onQuickInfoPress}
            style={styles.quickInfoBtn}
            hitSlop={8}
          >
            <Ionicons name="information" size={16} color="#ffffff" />
          </Pressable>
        ) : null}
      </View>

      {/* Información de la Cancha */}
      <View style={styles.detailsContainer}>
        {/* Fila: Nombre y Calificación */}
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {cancha.nombre}
          </Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#eab308" />
            <Text style={styles.ratingText}>{cancha.calificacion}</Text>
          </View>
        </View>

        {/* Ubicación / Barrio */}
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#64748b" />
          <Text style={styles.locationText} numberOfLines={1}>
            {cancha.barrio} - {cancha.direccion}
          </Text>
        </View>

        {/* Jugadores y Superficie */}
        <View style={styles.infoRow}>
          <Ionicons name="people-outline" size={14} color="#64748b" />
          <Text style={styles.metaText}>{cancha.jugadores}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.metaText}>{cancha.superficie}</Text>
        </View>

        {/* Precio destacado */}
        <View style={styles.footerRow}>
          <Text style={styles.priceHighlight}>${formattedPrice}</Text>
          <Text style={styles.perHourText}> / hora</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  imageContainer: {
    width: '100%',
    height: 190,
    backgroundColor: '#e2e8f0',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  typeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  typeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  quickInfoBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef9c3',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#854d0e',
    marginLeft: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    flex: 1,
  },
  metaText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 4,
  },
  dotSeparator: {
    marginHorizontal: 6,
    color: '#94a3b8',
    fontSize: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f8fafc',
  },
  priceHighlight: {
    fontSize: 19,
    fontWeight: '800',
    color: '#16a34a',
  },
  perHourText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
});
