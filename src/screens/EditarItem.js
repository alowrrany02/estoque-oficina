import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { doc, updateDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function EditarItem({ route, navigation }) {
  // Extração segura dos parâmetros
  const itemId = route.params?.itemId || '';
  
  // Estados do componente
  const [item, setItem] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [valor, setValor] = useState('0.00');
  const [categoriaId, setCategoriaId] = useState('');
  const [categoriaNome, setCategoriaNome] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCategorias, setShowCategorias] = useState(false);

  // Carrega os dados do item e categorias
  useEffect(() => {
    const loadData = async () => {
      try {
        // Carrega o item
        if (itemId) {
          const itemRef = doc(db, 'itens', itemId);
          const itemSnap = await getDoc(itemRef);
          
          if (itemSnap.exists()) {
            const itemData = itemSnap.data();
            setItem(itemData);
            setNome(itemData.nome || '');
            setDescricao(itemData.descricao || '');
            setQuantidade(String(itemData.quantidade || '0'));
            setValor(String(itemData.valor || '0.00'));
            setCategoriaId(itemData.categoriaId || '');
          }
        }

        // Carrega categorias
        const categoriesSnapshot = await getDocs(collection(db, 'categorias'));
        const loadedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome || 'Sem nome',
          ...doc.data()
        }));
        
        setCategorias(loadedCategories);

        // Atualiza nome da categoria selecionada
        if (item?.categoriaId) {
          const selectedCat = loadedCategories.find(c => c.id === item.categoriaId);
          if (selectedCat) {
            setCategoriaNome(selectedCat.nome);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [itemId]);

  const handleSave = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'O nome do item é obrigatório');
      return;
    }

    const qtd = parseInt(quantidade);
    if (isNaN(qtd)) {
      Alert.alert('Atenção', 'Quantidade inválida');
      return;
    }

    const val = parseFloat(valor);
    if (isNaN(val)) {
      Alert.alert('Atenção', 'Valor inválido');
      return;
    }

    if (!categoriaId) {
      Alert.alert('Atenção', 'Selecione uma categoria');
      return;
    }

    try {
      setSaving(true);
      
      await updateDoc(doc(db, 'itens', itemId), {
        nome: nome.trim(),
        descricao: descricao.trim(),
        quantidade: qtd,
        valor: val,
        categoriaId,
        atualizadoEm: new Date()
      });

      Alert.alert('Sucesso', 'Item atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSaving(false);
    }
  };

  const selectCategoria = (cat) => {
    setCategoriaId(cat.id);
    setCategoriaNome(cat.nome);
    setShowCategorias(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Carregando item...</Text>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Item não encontrado</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Editar Item</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nome*</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Nome do item"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Descrição</Text>
        <TextInput
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Descrição do item"
          style={[styles.input, styles.multilineInput]}
          multiline
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Quantidade*</Text>
          <TextInput
            value={quantidade}
            onChangeText={text => setQuantidade(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="0"
            style={styles.input}
          />
        </View>

        <View style={[styles.inputGroup, styles.halfWidth]}>
          <Text style={styles.label}>Valor (R$)*</Text>
          <TextInput
            value={valor}
            onChangeText={text => {
              const cleaned = text.replace(/[^0-9.]/g, '');
              const parts = cleaned.split('.');
              if (parts.length <= 2) {
                setValor(cleaned);
              }
            }}
            keyboardType="decimal-pad"
            placeholder="0.00"
            style={styles.input}
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Categoria*</Text>
        <TouchableOpacity
          onPress={() => setShowCategorias(true)}
          style={styles.categorySelector}
        >
          <Text style={styles.categoryText}>
            {categoriaNome || 'Selecione uma categoria'}
          </Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, saving && styles.saveButtonDisabled]}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>

      {/* Modal de seleção de categorias */}
      <Modal
        visible={showCategorias}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategorias(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Selecione uma categoria</Text>
            
            <FlatList
              data={categorias}
              keyExtractor={item => item.id}
              renderItem={({ item: cat }) => (
                <TouchableOpacity
                  onPress={() => selectCategoria(cat)}
                  style={[
                    styles.modalItem,
                    categoriaId === cat.id && styles.selectedModalItem
                  ]}
                >
                  <Text>{cat.nome}</Text>
                  {categoriaId === cat.id && (
                    <Ionicons name="checkmark" size={20} color="#1976d2" />
                  )}
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />

            <TouchableOpacity
              onPress={() => setShowCategorias(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e53935',
    marginBottom: 20,
  },
  backButton: {
    padding: 12,
    backgroundColor: '#1976d2',
    borderRadius: 6,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 12,
  },
  categoryText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#81c784',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedModalItem: {
    backgroundColor: '#f5f5f5',
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  modalCloseButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#1976d2',
    borderRadius: 6,
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});