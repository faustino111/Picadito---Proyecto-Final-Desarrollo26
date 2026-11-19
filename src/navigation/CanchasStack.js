import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { CanchasListScreen } from '../screens/CanchasListScreen';
import { CanchaDetailScreen } from '../screens/CanchaDetailScreen';

const Stack = createStackNavigator();

// Stack de inicio: Home (Barra de búsqueda Hero) -> CanchasList (Resultados) -> CanchaDetail
export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ExplorarCanchas" component={CanchasListScreen} />
      <Stack.Screen name="CanchaDetail" component={CanchaDetailScreen} />
    </Stack.Navigator>
  );
};
