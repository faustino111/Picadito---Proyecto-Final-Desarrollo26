import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Pressable,
  RefreshControl,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { INITIAL_CANCHAS, CATEGORIAS_FUTBOL } from '../services/canchasData';
import { CanchaCard } from '../components/CanchaCard';
import { CustomModal } from '../components/CustomModal';

export const CanchasListScreen = ({ route, navigation }) => {
  const initialCiudad = route.params?.ciudad || '';
  const initialCategoria = route.params?.categoria || 'todas';

  const [canchas, setCanchas] = useState(INITIAL_CANCHAS);
  const [selectedCategoria, setSelectedCategoria] = useState(initialCategoria);
  const [searchQuery, setSearchQuery] = useState(initialCiudad);
  const [refreshing, setRefreshing] = useState(false);

  // Modal rápido de preview
  const [modalVisible, setModalVisible] = useState(false);
  const [canchaModal, setCanchaModal] = useState(null);

  // Sincronizar si cambian los parámetros de navegación
  useEffect(() => {
    if (route.params?.ciudad !== undefined) {
      setSearchQuery(route.params.ciudad);
    }
    if (route.params?.categoria !== undefined) {
      setSelectedCategoria(route.params.categoria);
    }
  }, [route.params]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setCanchas(INITIAL_CANCHAS);
      setRefreshing(false);
    }, 600);
  };

  const getFilteredCanchas = () => {
    const query = searchQuery.trim().toLowerCase();
    const result = [];

    for (let i = 0; i < canchas.length; i++) {
      const c = canchas[i];
      const matchCategory =
        selectedCategoria === 'todas' || c.tipo === selectedCategoria;
      const matchQuery =
        !query ||
        c.nombre.toLowerCase().includes(query) ||
        c.barrio.toLowerCase().includes(query) ||
        (c.ciudad && c.ciudad.toLowerCase().includes(query)) ||
        c.tipo.toLowerCase().includes(query);

      if (matchCategory && matchQuery) {
        result.push(c);
      }
    }
    return result;
  };

  const filteredCanchas = getFilteredCanchas();

  const handleGoToDetail = (cancha) => {
    if (modalVisible) {
      setModalVisible(false);
    }
    navigation.navigate('CanchaDetail', { cancha });
  };

  const renderCategoriaItem = ({ item }) => {
    const isSelected = selectedCategoria === item.id;
    return (
      <Pressable
        onPress={() => setSelectedCategoria(item.id)}
        style={({ pressed }) => [
          styles.categoryPill,
          isSelected && styles.categoryPillActive,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons
          name="football-outline"
          size={14}
          color={isSelected ? '#ffffff' : '#64748b'}
          style={styles.pillIcon}
        />
        <Text
          style={[
            styles.categoryPillText,
            isSelected && styles.categoryPillTextActive,
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  };

  const renderCanchaItem = ({ item }) => (
    <CanchaCard
      cancha={item}
      onPress={() => handleGoToDetail(item)}
      onQuickInfoPress={() => {
        setCanchaModal(item);
        setModalVisible(true);
      }}
    />
  );

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Barra superior con botón Volver */}
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </Pressable>
          <View style={styles.headerInfo}>
            <Text style={styles.headerTitle}>Canchas Disponibles</Text>
            <Text style={styles.headerSubtitle}>
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : 'Todas las ciudades'}
            </Text>
          </View>
        </View>

        {/* Buscador */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Buscar por ciudad o predio..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
          />
          {searchQuery.length > 0 ? (
            <Pressable onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </Pressable>
          ) : null}
        </View>

        {/* Categorías */}
        <View style={styles.categoriesContainer}>
          <FlatList
            data={CATEGORIAS_FUTBOL}
            renderItem={renderCategoriaItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Lista de canchas */}
        <FlatList
          data={filteredCanchas}
          keyExtractor={(item) => item.id}
          renderItem={renderCanchaItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.canchasList}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#16a34a']}
              tintColor="#16a34a"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color="#cbd5e1" />
              <Text style={styles.emptyTitle}>No encontramos canchas</Text>
              <Text style={styles.emptyText}>
                Probá buscando en otra ciudad como "Las Varillas", "Córdoba", "Santa Fe" o "Mendoza".
              </Text>
            </View>
          }
        />

        {/* Modal de vista rápida */}
        <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          title={canchaModal?.nombre}
          subtitle={`${canchaModal?.barrio} • ${canchaModal?.tipo}`}
          imageUri={canchaModal?.imagen}
          confirmText="Ver Detalle Completo"
          confirmIcon="arrow-forward"
          onConfirm={() => handleGoToDetail(canchaModal)}
        >
          {canchaModal && (
            <View style={styles.modalBody}>
              <View style={styles.modalInfoRow}>
                <Ionicons name="people" size={18} color="#16a34a" />
                <Text style={styles.modalInfoText}>{canchaModal.jugadores}</Text>
              </View>
              <View style={styles.modalInfoRow}>
                <Ionicons name="location" size={18} color="#16a34a" />
                <Text style={styles.modalInfoText}>{canchaModal.direccion}</Text>
              </View>
              <View style={styles.modalPriceContainer}>
                <Text style={styles.modalPriceLabel}>Precio por hora:</Text>
                <Text style={styles.modalPriceVal}>
                  ${Number(canchaModal.precio).toLocaleString('es-AR')}
                </Text>
              </View>
            </View>
          )}
        </CustomModal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  categoriesContainer: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 2,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: '#16a34a',
  },
  pillIcon: {
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  categoryPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  canchasList: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalBody: {
    gap: 12,
    marginTop: 4,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 10,
  },
  modalInfoText: {
    marginLeft: 10,
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
    flex: 1,
  },
  modalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },
  modalPriceLabel: {
    fontSize: 14,
    color: '#166534',
    fontWeight: '600',
  },
  modalPriceVal: {
    fontSize: 18,
    color: '#16a34a',
    fontWeight: '800',
  },
});
