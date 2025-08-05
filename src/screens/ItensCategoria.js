import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  ImageBackground,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebaseConfig';

export default function ItensCategoria() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // EXTRAÇÃO SEGURA DOS PARÂMETROS
  const params = route.params || {};
  const categoriaId = params.categoriaId || '';
  const categoriaNome = params.categoriaNome || 'Categoria';

  const [itens, setItens] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const buscarItens = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setCarregando(true);
    }

    try {
      if (!categoriaId) {
        throw new Error('ID da categoria não encontrado');
      }

      const q = query(collection(db, 'itens'), where('categoriaId', '==', categoriaId));
      const querySnapshot = await getDocs(q);
      
      const lista = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome || 'Item sem nome',
        descricao: doc.data().descricao || '',
        quantidade: doc.data().quantidade || 0,
        valor: doc.data().valor || 0,
        categoriaId: doc.data().categoriaId || categoriaId
      }));

      setItens(lista);
    } catch (error) {
      Alert.alert('Erro', error.message);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setCarregando(false);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      
      if (mounted) {
        buscarItens();
      }

      return () => {
        mounted = false;
      };
    }, [categoriaId])
  );

  const handleExcluirItem = (itemId) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, 'itens', itemId));
              buscarItens();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o item');
            }
          }
        }
      ]
    );
  };

  const itensFiltrados = itens.filter(item => 
    item.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  const renderItem = ({ item }) => (
    
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemNome} numberOfLines={1}>{item.nome}</Text>
        {item.descricao ? (
          <Text style={styles.itemDesc} numberOfLines={2}>{item.descricao}</Text>
        ) : null}
        <View style={styles.itemDetails}>
          <Text style={styles.itemDetail}>Qtd: {item.quantidade}</Text>
          <Text style={[styles.itemDetail, styles.itemValue]}>
            R$ {Number(item.valor).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditarItem', { 
            itemId: item.id,
            categoriaId: item.categoriaId,
            itemData: item
          })}
          style={styles.actionButton}
        >
          <Ionicons name="create-outline" size={22} color="#ffffffff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => handleExcluirItem(item.id)}
          style={[styles.actionButton, styles.deleteButton]}
        >
          <Ionicons name="trash-outline" size={22} color="#ffffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (carregando && !refreshing) {
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
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          placeholder="Buscar item..."
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
          style={styles.searchInput}
          clearButtonMode="while-editing"
        />
      </View>
      
      <FlatList
        data={itensFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => buscarItens(true)}
            colors={['#1976d2']}
            tintColor="#1976d2"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="list-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>
              {pesquisa 
                ? 'Nenhum item encontrado para sua busca' 
                : 'Nenhum item cadastrado nesta categoria'}
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
    marginBottom:"8%",
  },
  content: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    height: "90%",
    justifyContent:"space-evenly",
    flexDirection:"column",
    alignItems:"center",
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    marginTop:"8%",
    height: 48,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    width:"95%",
    margin:"auto",
  },
  itemContainer: {
    width:"100%",
    backgroundColor: 'darkblue',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 1,
    marginBottom:10,
  },
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 14,
    color: '#ecececff',
    marginBottom: 8,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDetail: {
    fontSize: 14,
    color: '#e8e8e8ff',
    marginRight: 12,
  },
  itemValue: {
    color: '#fff',
    fontWeight: '600',
  },
  itemActions: {
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
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 24,
  },
});