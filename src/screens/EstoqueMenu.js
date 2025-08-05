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
          source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
          style={styles.fundo}
        >
        
      <View style={styles.container}>
        <View style={styles.content}>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar item..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
            />
          </View>
        <View style={styles.containerMenu}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('NovaCategoria')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="add-circle-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.optionText}>Criar Nova Categoria</Text>
            <Ionicons style={styles.optionIconContainer} name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('NovoItem')}
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="add-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.optionText}>Adicionar Novo Item</Text>
            <Ionicons style={styles.optionIconContainer} name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate('ListaCategorias')} 
          >
            <View style={styles.optionIconContainer}>
              <Ionicons name="list-outline" size={24}  color="#fff" />
            </View>
            <Text style={styles.optionText}>Ver Categorias</Text>
            <Ionicons style={styles.optionIconContainer} name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
          </View>
          <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fundo: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,// Opcional: overlay escuro para melhor legibilidade
    
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 12,

  },
  containerMenu:{
    gap:5,
  },
  content: {
     borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    height: "60%",
    justifyContent:"space-evenly",
    flexDirection:"column",
    alignItems:"center",
  },
  
  searchContainer: {
    flexDirection: 'row',
    width: "90%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    
    backgroundColor: 'rgba(255, 255, 255, 1)', 
  },
   icon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'darkblue',
    borderRadius: 12,
    paddingVertical: 18,
    width:"85%",
    marginBottom: 10,
  },
  optionIconContainer: {
    width: 30,
    alignItems: 'center',
    marginLeft:10,
    marginRight:10,
  },
  optionText: {
    flex: 1,
    marginLeft: 1,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
