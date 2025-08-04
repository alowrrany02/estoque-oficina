import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Keyboard, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function EstoqueMenu() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation();

  const handleSearch = () => {
    Keyboard.dismiss();
    alert('Você pesquisou: ' + search);
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://static.vecteezy.com/ti/vetor-gratis/p1/1433919-fundo-azul-escuro-com-linhas-vetor.jpg' }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Menu do Estoque</Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar item..."
              placeholderTextColor="#aaa"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
          </View>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('NovaCategoria')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.optionText}>Criar Nova Categoria</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('NovoItem')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="add-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.optionText}>Adicionar Novo Item</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('ListaCategorias')} // 👈 Corrigido aqui
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="list-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.optionText}>Ver Categorias</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  content: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 25,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 25,
    height: 50,
  },
  icon: {
    marginRight: 10,
    color: '#fff',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(25, 118, 210, 0.7)',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  optionIconContainer: {
    width: 30,
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
