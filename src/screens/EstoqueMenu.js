import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput, 
  Keyboard, 
  ImageBackground, 
  Modal, 
  FlatList, 
  ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function EstoqueMenu() {
  const [search, setSearch] = useState('');
  const [resultados, setResultados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [itens, setItens] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const navigation = useNavigation();

  // Carregar dados do Firebase quando o componente montar
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      // Carregar categorias
      const categoriasSnapshot = await getDocs(collection(db, 'categorias'));
      const categoriasData = categoriasSnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome || 'Categoria sem nome',
        tipo: 'categoria'
      }));
      setCategorias(categoriasData);

      // Carregar itens
      const itensSnapshot = await getDocs(collection(db, 'itens'));
      const itensData = itensSnapshot.docs.map(doc => ({
        id: doc.id,
        nome: doc.data().nome || 'Item sem nome',
        descricao: doc.data().descricao || '',
        categoriaId: doc.data().categoriaId,
        tipo: 'item'
      }));
      setItens(itensData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) {
      alert('Digite algo para pesquisar');
      return;
    }

    Keyboard.dismiss();
    setCarregando(true);

    // Filtrar categorias que contenham o termo pesquisado
    const categoriasFiltradas = categorias.filter(categoria =>
      categoria.nome.toLowerCase().includes(search.toLowerCase())
    );

    // Filtrar itens que contenham o termo pesquisado
    const itensFiltrados = itens.filter(item =>
      item.nome.toLowerCase().includes(search.toLowerCase()) ||
      (item.descricao && item.descricao.toLowerCase().includes(search.toLowerCase()))
    );

    // Combinar resultados
    const todosResultados = [...categoriasFiltradas, ...itensFiltrados];
    
    setResultados(todosResultados);
    setCarregando(false);
    setModalVisible(true);
  };

  const handleItemPress = (item) => {
    setModalVisible(false);
    
    if (item.tipo === 'categoria') {
      // Navegar para a categoria
      navigation.navigate('ItensCategoria', {
        categoriaId: item.id,
        categoriaNome: item.nome
      });
    } else if (item.tipo === 'item') {
      // Navegar para a categoria do item
      navigation.navigate('ItensCategoria', {
        categoriaId: item.categoriaId,
        categoriaNome: 'Categoria do Item'
      });
    }
  };

  const renderResultado = ({ item }) => (
    <TouchableOpacity
      style={styles.resultadoItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.resultadoInfo}>
        <View style={styles.resultadoHeader}>
          <Ionicons 
            name={item.tipo === 'categoria' ? 'folder-outline' : 'cube-outline'} 
            size={20} 
            color="#1976d2" 
          />
          <Text style={styles.tipoText}>
            {item.tipo === 'categoria' ? 'Categoria' : 'Item'}
          </Text>
        </View>
        <Text style={styles.resultadoNome}>{item.nome}</Text>
        {item.descricao && (
          <Text style={styles.resultadoDesc} numberOfLines={2}>
            {item.descricao}
          </Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
          source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
          style={styles.fundo}
        >
        
      <View style={styles.container}>
        <View style={styles.content}>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar categorias ou itens..."
              placeholderTextColor="#666"
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

        {/* Modal com resultados da pesquisa */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Resultados para: "{search}"
                </Text>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>

              {carregando ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1976d2" />
                </View>
              ) : (
                <FlatList
                  data={resultados}
                  keyExtractor={(item) => `${item.tipo}-${item.id}`}
                  renderItem={renderResultado}
                  style={styles.resultadosList}
                  ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                      <Ionicons name="search-outline" size={48} color="#ccc" />
                      <Text style={styles.emptyText}>
                        Nenhum resultado encontrado
                      </Text>
                    </View>
                  }
                />
              )}
            </View>
          </View>
        </Modal>
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

  // Estilos do Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  
  // Estilos dos resultados
  resultadosList: {
    maxHeight: 400,
  },
  resultadoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultadoInfo: {
    flex: 1,
  },
  resultadoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  tipoText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
    marginLeft: 5,
    textTransform: 'uppercase',
  },
  resultadoNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  resultadoDesc: {
    fontSize: 14,
    color: '#666',
  },
  
  // Estados vazios e loading
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 10,
  },
});