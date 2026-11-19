import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeStack } from './CanchasStack';
import { MapScreen } from '../screens/MapScreen';
import { TurnosGuardadosScreen } from '../screens/TurnosGuardadosScreen';

const Tab = createBottomTabNavigator();

// Navegación por Tabs: Inicio, Mapa y Mis Turnos (Canchas NO es una pestaña fija, sino el resultado tras buscar)
export const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f1f5f9',
          height: 60 + (insets.bottom > 0 ? insets.bottom - 4 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Mapa') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Turnos') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          }
          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeStack}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen
        name="Mapa"
        component={MapScreen}
        options={{ tabBarLabel: 'Mapa' }}
      />
      <Tab.Screen
        name="Turnos"
        component={TurnosGuardadosScreen}
        options={{ tabBarLabel: 'Turnos' }}
      />
    </Tab.Navigator>
  );
};
