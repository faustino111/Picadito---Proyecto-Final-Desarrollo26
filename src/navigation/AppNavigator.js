import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AuthStack } from './AuthStack';
import { DrawerNavigator } from './DrawerNavigator';
import { Ionicons } from '@expo/vector-icons';

// Navegador principal condicional: si hay sesión va a Drawer, sino a AuthStack
export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.logoCircle}>
          <Ionicons name="football" size={48} color="#16a34a" />
        </View>
        <ActivityIndicator size="large" color="#16a34a" style={styles.spinner} />
        <Text style={styles.loadingText}>Iniciando Picadito!...</Text>
      </View>
    );
  }

  return user ? <DrawerNavigator /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0f172a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  spinner: {
    marginBottom: 12,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});
