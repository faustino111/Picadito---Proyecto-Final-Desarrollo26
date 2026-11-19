import React from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, Pressable, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { CustomButton } from '../components/CustomButton';

export const ProfileScreen = ({ navigation }) => {
  const { user, signOut, loading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que querés salir de Picadito!?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Jugador Picadito';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header con botón para abrir drawer */}
      <View style={styles.screenHeader}>
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
        <Text style={styles.screenHeaderTitle}>Mi Perfil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tarjeta de Perfil */}
      <View style={styles.profileCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarInitials}>
            {displayName.substring(0, 2).toUpperCase()}
          </Text>
        </View>

        <Text style={styles.userName}>{displayName}</Text>
        <Text style={styles.userEmail}>{user?.email || 'Sin correo registrado'}</Text>

        <View style={styles.statusPill}>
          <View style={styles.onlineDot} />
          <Text style={styles.statusText}>Sesión Activa y Persistente</Text>
        </View>
      </View>

      {/* Estadísticas del Jugador */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Partidos</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Reservas</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4.9</Text>
          <Text style={styles.statLabel}>Fair Play</Text>
        </View>
      </View>

      {/* Opciones y Configuración */}
      <View style={styles.menuGroup}>
        <View style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={20} color="#16a34a" />
          <Text style={styles.menuItemText}>Notificaciones de partidos</Text>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="card-outline" size={20} color="#16a34a" />
          <Text style={styles.menuItemText}>Métodos de pago guardados</Text>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>

        <View style={styles.menuItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#16a34a" />
          <Text style={styles.menuItemText}>Seguridad de cuenta (Supabase)</Text>
          <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
        </View>
      </View>

      {/* Botón Logout */}
      <View style={styles.logoutContainer}>
        <CustomButton
          title="Cerrar Sesión"
          variant="danger"
          iconName="log-out-outline"
          onPress={handleLogout}
          loading={loading}
        />
      </View>

      <Text style={styles.versionText}>Picadito! v1.0.0 - Proyecto Final</Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 12,
  },
  menuButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  screenHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#16a34a',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16a34a',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  menuGroup: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
  logoutContainer: {
    marginBottom: 16,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 24,
  },
});
