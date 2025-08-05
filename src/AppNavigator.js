// src/AppNavigator.js

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import EstoqueMenu from './screens/EstoqueMenu';
import NovaCategoria from './screens/NovaCategoria';
import NovoItem from './screens/NovoItem';
import ListaCategorias from './screens/ListaCategorias';
import ItensCategoria from './screens/ItensCategoria';
import EditarItem from './screens/EditarItem';
import EditarCategoria from './screens/EditarCategoria';




const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="EstoqueMenu" component={EstoqueMenu} />
      <Stack.Screen name="NovaCategoria" component={NovaCategoria} />
      <Stack.Screen name="NovoItem" component={NovoItem} />
      <Stack.Screen name="ListaCategorias" component={ListaCategorias} />
      <Stack.Screen name="ItensCategoria" component={ItensCategoria} />
      <Stack.Screen name="EditarItem" component={EditarItem} />
      <Stack.Screen name="EditarCategoria" component={EditarCategoria} />
    </Stack.Navigator>
  );
}
