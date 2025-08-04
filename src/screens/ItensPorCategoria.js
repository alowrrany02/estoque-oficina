import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function ItensCategoria() {
  const navigation = useNavigation();
  const route = useRoute();
  const { categoriaId, categoriaNome } = route.params;
  const [itens, setItens] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const buscarItens = async () => {
    try {
      const q = query(collection(db, 'itens'), where('categoriaId', '==', categoriaId));
      const querySnapshot = await getDocs(q);
      const itensData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItens(itensData);
    } catch (error) {
      console.error('Erro ao buscar itens:', error);
    }
  };

  useEffect(() => {
    buscarItens();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarItens();
    setRefreshing(false);
  };

  const confirmarExcluir = (id) => {
    Alert.alert('Confirmar exclusão', 'Tem certeza que deseja excluir este item?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => excluirItem(id) }
    ]);
  };

  const excluirItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'itens', id));
      buscarItens(); // atualiza a lista
    } catch (error) {
      console.error('Erro ao excluir item:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.info}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.desc}>{item.descricao}</Text>
        <Text style={styles.qtd}>Quantidade: {item.quantidade}</Text>
        <Text style={styles.valor}>R$ {item.valor}</Text>
      </View>
      <View style={styles.acoes}>
        <TouchableOpacity onPress={() => navigation.navigate('EditarItem', { item })}>
          <Ionicons name="create-outline" size={22} color="#1976d2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExcluir(item.id)}>
          <Ionicons name="trash-outline" size={22} color="#e53935" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.voltar}>
        <Ionicons name="arrow-back" size={24} color="#1976d2" />
        <Text style={styles.voltarTexto}>Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Itens da categoria: {categoriaNome}</Text>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum item encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  voltarTexto: {
    marginLeft: 6,
    color: '#1976d2',
    fontSize: 16,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  info: {
    marginBottom: 10,
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  desc: {
    color: '#555',
  },
  qtd: {
    color: '#000',
  },
  valor: {
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  acoes: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 15,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});
