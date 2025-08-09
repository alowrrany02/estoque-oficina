import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  Keyboard
} from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';

export default function ListaCategorias() {
  const [search, setSearch] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  // Buscar categorias do Firestore
  const buscarCategorias = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const querySnapshot = await getDocs(collection(db, 'categorias'));
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome || 'Categoria sem nome',
        ...doc.data()
      }));
      setCategorias(lista);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as categorias: ' + error.message);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      buscarCategorias();
    }, [])
  );

  // Ação ao submeter a pesquisa
  const handleSearch = () => {
    Keyboard.dismiss();
    // Não precisa mais alertar aqui, filtro será aplicado automaticamente abaixo
  };

  // Filtra categorias a partir do texto digitado em search
  const categoriasFiltradas = categorias.filter(cat =>
    cat.nome.toLowerCase().includes(search.toLowerCase())
  );

  const confirmarExclusao = (categoriaId, categoriaNome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Deseja excluir a categoria "${categoriaNome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => excluirCategoria(categoriaId),
        },
      ]
    );
  };

  const excluirCategoria = async (categoriaId) => {
    try {
      await deleteDoc(doc(db, 'categorias', categoriaId));
      buscarCategorias();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível excluir a categoria: ' + error.message);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() => navigation.navigate('ItensCategoria', {
          categoriaId: item.id,
          categoriaNome: item.nome
        })}
      >
        <Text style={styles.itemText} numberOfLines={1}>
          {item.nome}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarCategoria', {
            categoriaId: item.id,
            categoriaNome: item.nome
          })}
          style={styles.actionButton}
        >
          <Ionicons name="create-outline" size={22} color="#ffffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => confirmarExclusao(item.id, item.nome)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Ionicons name="trash-outline" size={22} color="#ffffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
      style={styles.fundo}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Categorias</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar categoria..."
              placeholderTextColor="#999"
              value={search}
              onChangeText={setSearch} // Atualiza o filtro conforme digita
              onSubmitEditing={handleSearch} // Pode ser opcional aqui, já que filtro é em tempo real
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
          </View>
          <FlatList
            style={styles.flatContainer}
            data={categoriasFiltradas}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => buscarCategorias(true)}
                colors={['#1976d2']}
                tintColor="#1976d2"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="folder-open-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>
                  Nenhuma categoria encontrada
                </Text>
              </View>
            }
          />
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
    flexGrow: 1,
  },
  flatContainer: {
    marginTop: "10%"
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginRight: 12,
    marginBottom: "8%",
  },
  content: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    height: "90%",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: "8%",
  },
  searchContainer: {
    flexDirection: 'row',
    width: "90%",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: "8%",
    color: '#000000ff',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  icon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  listContent: {
    paddingBottom: 2,
  },
  itemContainer: {
    backgroundColor: 'darkblue',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "95%"
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
  deleteButton: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
});
