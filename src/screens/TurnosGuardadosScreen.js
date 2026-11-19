import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const TurnosGuardadosScreen = ({ navigation }) => {
  const { turnos, removeTurno, user } = useAuth();

  const handleCancelTurno = (turno) => {
    Alert.alert(
      'Cancelar Turno',
      `¿Deseas cancelar el turno para "${turno.canchaNombre || 'esta cancha'}"?`,
      [
        { text: 'No, mantener', style: 'cancel' },
        {
          text: 'Sí, cancelar turno',
          style: 'destructive',
          onPress: async () => {
            await removeTurno(turno.id);
          },
        },
      ]
    );
  };

  const renderTurnoItem = ({ item }) => {
    const fechaHora = item.fechaCreacion
      ? new Date(item.fechaCreacion).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Reciente';

    return (
      <View style={styles.card}>
        {item.canchaImagen ? (
          <Image
            source={{ uri: item.canchaImagen }}
            style={styles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.cardImage, styles.placeholderImage]}>
            <Ionicons name="football" size={32} color="#16a34a" />
          </View>
        )}

        <View style={styles.cardBody}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.canchaNombre} numberOfLines={1}>
              {item.canchaNombre}
            </Text>
            <View style={styles.estadoBadge}>
              <Text style={styles.estadoText}>Confirmado</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color="#64748b" />
            <Text style={styles.infoText} numberOfLines={1}>
              {item.canchaDireccion || item.canchaBarrio || 'Cancha local'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="football-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>{item.canchaTipo || 'Fútbol'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text style={styles.infoText}>Reservado: {fechaHora}</Text>
          </View>

          {item.canchaPrecio && (
            <View style={styles.infoRow}>
              <Ionicons name="cash-outline" size={16} color="#16a34a" />
              <Text style={styles.precioText}>
                ${Number(item.canchaPrecio).toLocaleString('es-AR')}
              </Text>
            </View>
          )}

          {/* Botones de acción */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => handleCancelTurno(item)}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="trash-outline" size={16} color="#ef4444" />
              <Text style={styles.cancelText}>Cancelar Turno</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Cabecera */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {navigation.openDrawer && (
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={({ pressed }) => [
                styles.menuButton,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Ionicons name="menu" size={24} color="#0f172a" />
            </Pressable>
          )}
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Mis Turnos</Text>
            <Text style={styles.subtitle}>
              Turnos reservados guardados en tu cuenta
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Turnos */}
      {turnos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
          </View>
          <Text style={styles.emptyTitle}>No tienes turnos reservados</Text>
          <Text style={styles.emptySubtitle}>
            Cuando reserves una cancha desde la sección Explorar o Mapa,
            aparecerá aquí guardada incluso al cerrar sesión.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Canchas')}
            style={({ pressed }) => [
              styles.exploreButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="football" size={18} color="#ffffff" />
            <Text style={styles.exploreButtonText}>Explorar Canchas</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={turnos}
          keyExtractor={(item) => item.id}
          renderItem={renderTurnoItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 14,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  headerTitles: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: '100%',
    height: 140,
  },
  placeholderImage: {
    backgroundColor: '#dcfce7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  canchaNombre: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },
  estadoBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  estadoText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  infoText: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
  },
  precioText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#16a34a',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fef2f2',
    gap: 4,
  },
  cancelText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  exploreButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});
