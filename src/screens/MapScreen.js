import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
  FlatList,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { INITIAL_CANCHAS } from '../services/canchasData';

// Carga condicional segura para evitar el error UIManager.hasViewManagerConfig en Web o Expo Snack
let MapView = null;
let Marker = null;

if (Platform.OS !== 'web') {
  try {
    const MapsModule = require('react-native-maps');
    MapView = MapsModule.default;
    Marker = MapsModule.Marker;
  } catch (err) {
    console.warn('react-native-maps no disponible en esta plataforma');
  }
}

export const MapScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [selectedCancha, setSelectedCancha] = useState(INITIAL_CANCHAS[0]);

  // Región por defecto centrada en la zona centro (Córdoba / Las Varillas / Santa Fe)
  const [region, setRegion] = useState({
    latitude: -31.8715,
    longitude: -62.7198,
    latitudeDelta: 2.5,
    longitudeDelta: 2.5,
  });

  // Solicitar permisos de ubicación con expo-location
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          setLocationPermission(true);
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          const current = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
          };
          setUserLocation(loc.coords);
          setRegion(current);
          if (mapRef.current && mapRef.current.animateToRegion) {
            mapRef.current.animateToRegion(current, 1000);
          }
        } else {
          setLocationPermission(false);
        }
      } catch (err) {
        console.warn('Error obteniendo ubicación:', err);
      } finally {
        setLoadingLocation(false);
      }
    };

    requestLocation();
  }, []);

  const handleCenterOnUser = () => {
    if (userLocation && mapRef.current && mapRef.current.animateToRegion) {
      mapRef.current.animateToRegion(
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        800
      );
    } else {
      Alert.alert(
        'Ubicación',
        'Permiso de ubicación no concedido o no disponible en navegador.'
      );
    }
  };

  // Renderizado de marcadores nativos con ciclo tradicional for (CERO uso de .map)
  const renderCanchaMarkers = () => {
    if (!Marker) return null;
    const markers = [];
    for (let i = 0; i < INITIAL_CANCHAS.length; i++) {
      const c = INITIAL_CANCHAS[i];
      markers.push(
        <Marker
          key={c.id}
          coordinate={{ latitude: c.latitude, longitude: c.longitude }}
          onPress={() => setSelectedCancha(c)}
        >
          <View style={styles.customMarker}>
            <View style={styles.markerBubble}>
              <Text style={styles.markerIcon}>⚽</Text>
              <Text style={styles.markerText}>${c.precio / 1000}k</Text>
            </View>
            <View style={styles.markerArrow} />
          </View>
        </Marker>
      );
    }
    return markers;
  };

  // Render para los marcadores en modo Web / Snack
  const renderWebPinItem = ({ item }) => {
    const isSelected = selectedCancha?.id === item.id;
    return (
      <Pressable
        onPress={() => setSelectedCancha(item)}
        style={({ pressed }) => [
          styles.webPinCard,
          isSelected && styles.webPinCardSelected,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Text style={styles.webPinEmoji}>⚽</Text>
        <Text style={styles.webPinTitle} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={styles.webPinPrice}>
          ${Number(item.precio).toLocaleString('es-AR')}/h
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Si estamos en Android o iOS físico/emulador con MapView disponible */}
      {Platform.OS !== 'web' && MapView ? (
        <MapView
          ref={mapRef}
          style={styles.mapViewFull}
          initialRegion={region}
          showsUserLocation={locationPermission}
          showsMyLocationButton={false}
        >
          {renderCanchaMarkers()}
        </MapView>
      ) : (
        /* Vista interactiva de Mapa para Web y Expo Snack */
        <View style={styles.webMapFallback}>
          <View style={styles.webMapHeader}>
            <Ionicons name="map" size={40} color="#16a34a" />
            <Text style={styles.webMapTitle}>Mapa Satelital de Canchas</Text>
            <Text style={styles.webMapSubtitle}>
              Explora los puntos geolocalizados de cada predio:
            </Text>
          </View>

          <FlatList
            data={INITIAL_CANCHAS}
            renderItem={renderWebPinItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.webPinList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {/* Cabecera flotante */}
      <View
        style={[
          styles.floatingHeader,
          {
            top:
              Platform.OS === 'android'
                ? (StatusBar.currentHeight || 0) + 12
                : Math.max(insets.top, 16) + 8,
          },
        ]}
      >
        <View style={styles.floatingHeaderRow}>
          {navigation.openDrawer && (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="menu" size={22} color="#0f172a" />
            </Pressable>
          )}
          <View style={styles.floatingHeaderTitles}>
            <Text style={styles.headerTitle}>Mapa de Canchas ⚽</Text>
            <Text style={styles.headerSubtitle}>
              Tocá una cancha para ver la vista previa
            </Text>
          </View>
        </View>
      </View>

      {/* Botón flotante para centrar en mi ubicación */}
      {Platform.OS !== 'web' ? (
        <Pressable
          onPress={handleCenterOnUser}
          style={({ pressed }) => [
            styles.locateButton,
            pressed && { opacity: 0.8 },
          ]}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#16a34a" />
          ) : (
            <Ionicons name="navigate" size={22} color="#16a34a" />
          )}
        </Pressable>
      ) : null}

      {/* Tarjeta flotante inferior de la cancha seleccionada */}
      {selectedCancha ? (
        <View style={styles.bottomCard}>
          <Pressable
            onPress={() => setSelectedCancha(null)}
            style={styles.closeCardBtn}
            hitSlop={8}
          >
            <Ionicons name="close" size={18} color="#64748b" />
          </Pressable>

          <View style={styles.cardRow}>
            <Image
              source={{ uri: selectedCancha.imagen }}
              style={styles.cardThumb}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <View style={styles.tagRow}>
                <View style={styles.typeTag}>
                  <Text style={styles.typeTagText}>{selectedCancha.tipo}</Text>
                </View>
                <Text style={styles.cardRating}>
                  ⭐ {selectedCancha.calificacion}
                </Text>
              </View>

              <Text style={styles.cardTitle} numberOfLines={1}>
                {selectedCancha.nombre}
              </Text>
              <Text style={styles.cardAddress} numberOfLines={1}>
                {selectedCancha.barrio}
              </Text>

              <View style={styles.cardActionRow}>
                <Text style={styles.cardPrice}>
                  ${Number(selectedCancha.precio).toLocaleString('es-AR')}{' '}
                  <Text style={styles.cardPriceSub}>/h</Text>
                </Text>

                <Pressable
                  onPress={() =>
                    navigation.navigate('CanchaDetail', {
                      cancha: selectedCancha,
                    })
                  }
                  style={({ pressed }) => [
                    styles.viewDetailBtn,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={styles.viewDetailText}>Ver Cancha</Text>
                  <Ionicons name="arrow-forward" size={14} color="#ffffff" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  mapViewFull: {
    ...StyleSheet.absoluteFillObject,
  },
  webMapFallback: {
    flex: 1,
    paddingTop: 110,
    paddingHorizontal: 20,
    backgroundColor: '#f1f5f9',
  },
  webMapHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  webMapTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 6,
  },
  webMapSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  webPinList: {
    paddingBottom: 160,
    gap: 10,
  },
  webPinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  webPinCardSelected: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },
  webPinEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  webPinTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  webPinPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#16a34a',
  },
  floatingHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  floatingHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  floatingHeaderTitles: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  locateButton: {
    position: 'absolute',
    right: 20,
    bottom: 220,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  customMarker: {
    alignItems: 'center',
  },
  markerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  markerIcon: {
    fontSize: 13,
    marginRight: 4,
  },
  markerText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  markerArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#16a34a',
    alignSelf: 'center',
  },
  bottomCard: {
    position: 'absolute',
    bottom: 24,
    left: 18,
    right: 18,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  closeCardBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
  },
  cardThumb: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#e2e8f0',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  tagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 24,
  },
  typeTag: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeTagText: {
    color: '#16a34a',
    fontSize: 11,
    fontWeight: '700',
  },
  cardRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#854d0e',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  cardAddress: {
    fontSize: 12,
    color: '#64748b',
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#16a34a',
  },
  cardPriceSub: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewDetailText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
    marginRight: 4,
  },
});
