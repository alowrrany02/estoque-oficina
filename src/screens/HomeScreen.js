// src/screens/HomeScreen.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      alert('Erro ao sair: ' + error.message);
    }
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    alert('Você pesquisou: ' + search);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
      style={styles.fundo}
    >
      <View style={styles.container}>
        <View style={styles.content}>
        <TouchableOpacity style={[styles.buttonSair]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar item..."
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EstoqueMenu')}>
            <Text style={styles.buttonText}>Estoque</Text>
          </TouchableOpacity>

          
        </View>
      </View>
      </ImageBackground>
  );
}

const styles = StyleSheet.create({
  
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,// Opcional: overlay escuro para melhor legibilidade
    
  },
  fundo: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  content: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    height: 355,
    
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff', // Mudei para branco para melhor contraste com fundo
  },
  searchContainer: {
    flexDirection: 'row',
    width: "90%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    margin:"auto",
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fundo semi-transparente
  },
  icon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  button: {
    paddingVertical: 30,
    width: "80%",
    alignItems: 'center',
    backgroundColor:"darkblue",
    borderRadius:8,
    margin: "auto", // Fundo semi-transparente
  },
  buttonSair: {
    margin: 10,
    paddingVertical: 10,
    borderRadius: 8,
    width: 60,
    backgroundColor: "darkblue", // Vermelho com transparência
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: "center",
    fontWeight: 'bold',
  },
});