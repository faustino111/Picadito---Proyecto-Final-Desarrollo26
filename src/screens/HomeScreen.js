import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TextInput,
  Pressable,
  Platform,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CATEGORIAS_FUTBOL } from '../services/canchasData';

const CIUDADES_DISPONIBLES = [
  'Todas las ciudades',
  'Las Varillas',
  'Córdoba Capital',
  'Santa Fe Capital',
  'Mendoza Capital',
];

export const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [modalCiudadVisible, setModalCiudadVisible] = useState(false);
  const [modalDeporteVisible, setModalDeporteVisible] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todas');

  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Jugador';

  const handleBuscar = () => {
    navigation.navigate('ExplorarCanchas', {
      ciudad: ciudadSeleccionada === 'Todas las ciudades' ? '' : ciudadSeleccionada,
      categoria: categoriaSeleccionada,
    });
  };

  const getCategoriaLabel = () => {
    const cat = CATEGORIAS_FUTBOL.find((c) => c.id === categoriaSeleccionada);
    return cat ? cat.label : 'Elige modalidad';
  };

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      {/* Barra superior con botón del Drawer a la izquierda y saludo */}
      <View style={styles.topBar}>
        {navigation.openDrawer && (
          <Pressable
            onPress={() => navigation.openDrawer()}
            style={({ pressed }) => [
              styles.drawerButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="menu" size={24} color="#0f172a" />
          </Pressable>
        )}
        <View style={styles.brandTitleContainer}>
          <Text style={styles.brandTitle}>Picadito!</Text>
        </View>
        <View style={styles.userBadge}>
          <Ionicons name="person-circle" size={24} color="#16a34a" />
          <Text style={styles.userBadgeText} numberOfLines={1}>
            {userName}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Hero estilo web (con imagen de fútbol y degradado) */}
        <ImageBackground
          source={{
            uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.heroBackground}
          imageStyle={styles.heroImage}
        >
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>
              Reserva tu cancha{'\n'}al instante
            </Text>
            <Text style={styles.heroSubtitle}>
              Explorá las canchas disponibles en tu ciudad y en tiempo real.
            </Text>

            {/* Barra de Búsqueda estilo píldora distribuida según la imagen */}
            <View style={styles.searchBarCard}>
              {/* Opción 1: Buscar Ciudad */}
              <Pressable
                onPress={() => setModalCiudadVisible(true)}
                style={({ pressed }) => [
                  styles.searchField,
                  styles.fieldBorderRight,
                  pressed && styles.searchFieldPressed,
                ]}
              >
                <Ionicons name="location-outline" size={20} color="#16a34a" />
                <View style={styles.fieldTextContainer}>
                  <Text style={styles.fieldLabel}>Ciudad</Text>
                  <Text style={styles.fieldValue} numberOfLines={1}>
                    {ciudadSeleccionada || 'Buscar Ciudad'}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={14} color="#94a3b8" />
              </Pressable>

              {/* Opción 2: Elige Deporte / Modalidad */}
              <Pressable
                onPress={() => setModalDeporteVisible(true)}
                style={({ pressed }) => [
                  styles.searchField,
                  pressed && styles.searchFieldPressed,
                ]}
              >
                <Ionicons name="football-outline" size={20} color="#16a34a" />
                <View style={styles.fieldTextContainer}>
                  <Text style={styles.fieldLabel}>Modalidad</Text>
                  <Text style={styles.fieldValue} numberOfLines={1}>
                    {getCategoriaLabel()}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={14} color="#94a3b8" />
              </Pressable>

              {/* Botón Buscar Canchas */}
              <Pressable
                onPress={handleBuscar}
                style={({ pressed }) => [
                  styles.searchButton,
                  pressed && { opacity: 0.85 },
                ]}
              >
                <Ionicons name="search" size={18} color="#ffffff" />
                <Text style={styles.searchButtonText}>Buscar canchas</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>

        {/* Sección inferior con tarjeta informativa "Únete a partidos..." */}
        <View style={styles.bottomSection}>
          <View style={styles.promoCard}>
            <View style={styles.nuevoBadge}>
              <Text style={styles.nuevoBadgeText}>NUEVO</Text>
            </View>
            <Text style={styles.promoTitle}>
              Únete a partidos o abre el tuyo, conoce gente y jugá
            </Text>
            <Text style={styles.promoDesc}>
              Encontrá equipos a los que les falta un jugador o armá tu desafío en canchas verificadas.
            </Text>
            <Pressable
              onPress={() => navigation.navigate('ExplorarCanchas', {})}
              style={({ pressed }) => [
                styles.promoButton,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.promoButtonText}>Ver todas las canchas</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </Pressable>
          </View>

          {/* Accesos rápidos a ciudades */}
          <Text style={styles.ciudadesHeader}>Ciudades destacadas</Text>
          <View style={styles.ciudadesGrid}>
            {['Las Varillas', 'Córdoba Capital', 'Santa Fe Capital', 'Mendoza Capital'].map(
              (city) => (
                <Pressable
                  key={city}
                  onPress={() => {
                    setCiudadSeleccionada(city);
                    navigation.navigate('ExplorarCanchas', { ciudad: city });
                  }}
                  style={({ pressed }) => [
                    styles.cityPill,
                    pressed && styles.cityPillPressed,
                  ]}
                >
                  <Ionicons name="location" size={16} color="#16a34a" />
                  <Text style={styles.cityPillText}>{city}</Text>
                </Pressable>
              )
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal para Selección de Ciudad */}
      <Modal
        visible={modalCiudadVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalCiudadVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Selecciona tu Ciudad</Text>
              <Pressable
                onPress={() => setModalCiudadVisible(false)}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={26} color="#94a3b8" />
              </Pressable>
            </View>

            {CIUDADES_DISPONIBLES.map((city) => {
              const isSelected =
                ciudadSeleccionada === city ||
                (!ciudadSeleccionada && city === 'Todas las ciudades');
              return (
                <Pressable
                  key={city}
                  onPress={() => {
                    setCiudadSeleccionada(city === 'Todas las ciudades' ? '' : city);
                    setModalCiudadVisible(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOptionItem,
                    isSelected && styles.modalOptionSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name="business-outline"
                    size={20}
                    color={isSelected ? '#16a34a' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {city}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* Modal para Selección de Deporte / Modalidad */}
      <Modal
        visible={modalDeporteVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalDeporteVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalSheetHeader}>
              <Text style={styles.modalSheetTitle}>Selecciona la Modalidad</Text>
              <Pressable
                onPress={() => setModalDeporteVisible(false)}
                hitSlop={8}
              >
                <Ionicons name="close-circle" size={26} color="#94a3b8" />
              </Pressable>
            </View>

            {CATEGORIAS_FUTBOL.map((cat) => {
              const isSelected = categoriaSeleccionada === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => {
                    setCategoriaSeleccionada(cat.id);
                    setModalDeporteVisible(false);
                  }}
                  style={({ pressed }) => [
                    styles.modalOptionItem,
                    isSelected && styles.modalOptionSelected,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Ionicons
                    name="football"
                    size={20}
                    color={isSelected ? '#16a34a' : '#64748b'}
                  />
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && styles.modalOptionTextSelected,
                    ]}
                  >
                    {cat.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  drawerButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  brandTitleContainer: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#16a34a',
    letterSpacing: 0.5,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
    maxWidth: 130,
  },
  userBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803d',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroBackground: {
    width: '100%',
    minHeight: 380,
    justifyContent: 'center',
  },
  heroImage: {
    resizeMode: 'cover',
  },
  heroOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    paddingHorizontal: 20,
    paddingVertical: 36,
    justifyContent: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#16a34a',
    lineHeight: 34,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 320,
  },
  searchBarCard: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 8,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#f8fafc',
    gap: 10,
  },
  fieldBorderRight: {
    // en vertical apilado queda limpio como tarjeta
  },
  searchFieldPressed: {
    backgroundColor: '#f1f5f9',
  },
  fieldTextContainer: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  fieldValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  searchButton: {
    backgroundColor: '#94a3b8',
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
    marginTop: 4,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  bottomSection: {
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  promoCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 22,
    marginBottom: 24,
  },
  nuevoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#16a34a',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 10,
  },
  nuevoBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 24,
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 19,
    marginBottom: 16,
  },
  promoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#16a34a',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  promoButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  ciudadesHeader: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },
  ciudadesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  cityPillPressed: {
    backgroundColor: '#e2e8f0',
  },
  cityPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    gap: 8,
  },
  modalSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    marginBottom: 8,
  },
  modalSheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  modalOptionSelected: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#16a34a',
  },
  modalOptionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  modalOptionTextSelected: {
    color: '#16a34a',
    fontWeight: '800',
  },
});
