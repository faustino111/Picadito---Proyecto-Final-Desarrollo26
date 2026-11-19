import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { StyleSheet, Text, View, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabNavigator } from './TabNavigator';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TurnosGuardadosScreen } from '../screens/TurnosGuardadosScreen';
import { CanchasListScreen } from '../screens/CanchasListScreen';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

// Contenido personalizado del Drawer lateral con componentes Pressable
const CustomDrawerContent = (props) => {
  const { user, signOut } = useAuth();
  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Jugador';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Deseas cerrar tu sesión actual de Picadito!?',
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

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContainer}
    >
      {/* Cabecera del Drawer */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="football" size={32} color="#ffffff" />
        </View>
        <Text style={styles.appName}>Picadito!</Text>
        <Text style={styles.userGreeting}>Hola, {userName}</Text>
        <Text style={styles.userEmail} numberOfLines={1}>
          {user?.email}
        </Text>
      </View>

      {/* Enlaces de navegación con Pressable */}
      <View style={styles.menuItems}>
        <Pressable
          onPress={() => props.navigation.navigate('Principal', { screen: 'Inicio' })}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <Ionicons name="home-outline" size={22} color="#16a34a" />
          <Text style={styles.drawerItemLabel}>Inicio</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            props.navigation.navigate('Principal', {
              screen: 'Inicio',
              params: { screen: 'ExplorarCanchas' },
            })
          }
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <Ionicons name="football-outline" size={22} color="#16a34a" />
          <Text style={styles.drawerItemLabel}>Explorar Canchas</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            props.navigation.navigate('Principal', { screen: 'Mapa' })
          }
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <Ionicons name="map-outline" size={22} color="#0284c7" />
          <Text style={styles.drawerItemLabel}>Mapa Interactivo</Text>
        </Pressable>

        <Pressable
          onPress={() =>
            props.navigation.navigate('Principal', { screen: 'Turnos' })
          }
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <Ionicons name="calendar-outline" size={22} color="#f59e0b" />
          <Text style={styles.drawerItemLabel}>Turnos Guardados</Text>
        </Pressable>

        <Pressable
          onPress={() => props.navigation.navigate('MiPerfil')}
          style={({ pressed }) => [
            styles.drawerItem,
            pressed && styles.drawerItemPressed,
          ]}
        >
          <Ionicons name="person-outline" size={22} color="#7c3aed" />
          <Text style={styles.drawerItemLabel}>Mi Perfil</Text>
        </Pressable>
      </View>

      {/* Botón Logout al pie del Drawer */}
      <View style={styles.footer}>
        <Pressable
          onPress={handleLogout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && { backgroundColor: '#fee2e2' },
          ]}
        >
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
};

export const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#16a34a',
        drawerInactiveTintColor: '#475569',
      }}
    >
      <Drawer.Screen name="Principal" component={TabNavigator} />
      <Drawer.Screen name="TurnosDrawer" component={TurnosGuardadosScreen} />
      <Drawer.Screen name="MiPerfil" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#0f172a',
    marginBottom: 16,
    borderRadius: 14,
    marginHorizontal: 10,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  userGreeting: {
    fontSize: 14,
    fontWeight: '700',
    color: '#e2e8f0',
    marginTop: 4,
  },
  userEmail: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
    paddingHorizontal: 10,
    gap: 6,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  drawerItemPressed: {
    backgroundColor: '#f1f5f9',
  },
  drawerItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 14,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#dc2626',
    marginLeft: 12,
  },
});
