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
  ImageBackground,
} from 'react-native';
import { doc, updateDoc, getDocs, collection, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function EditarItem({ route, navigation }) {
  const itemId = route.params?.itemId || '';
  
  const [item, setItem] = useState(null);
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [valor, setValor] = useState('0.00');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
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

        const categoriesSnapshot = await getDocs(collection(db, 'categorias'));
        const loadedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          nome: doc.data().nome || 'Sem nome',
          ...doc.data()
        }));
        
        setCategorias(loadedCategories);
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
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
      style={styles.fundo}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Editar Item</Text>
          <View style={styles.contentInputs}>
            <Text style={styles.label}>Nome do Item:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome do item"
              placeholderTextColor="#666666"
              value={nome}
              onChangeText={setNome}
            />

            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a descrição do item"
              placeholderTextColor="#666666"
              value={descricao}
              onChangeText={setDescricao}
              multiline={true}
              numberOfLines={2}
            />

            <Text style={styles.label}>Quantidade:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a quantidade"
              placeholderTextColor="#666666"
              keyboardType="numeric"
              value={quantidade}
              onChangeText={text => setQuantidade(text.replace(/[^0-9]/g, ''))}
            />

            <Text style={styles.label}>Valor (R$):</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o valor"
              placeholderTextColor="#666666"
              keyboardType="decimal-pad"
              value={valor}
              onChangeText={text => {
                const cleaned = text.replace(/[^0-9.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length <= 2) {
                  setValor(cleaned);
                }
              }}
            />

            <Text style={styles.label}>Selecione a Categoria:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={categoriaId}
                onValueChange={(itemValue) => setCategoriaId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione uma categoria" value="" color="#666666" />
                {categorias.map((cat) => (
                  <Picker.Item key={cat.id} label={cat.nome} value={cat.id} color="#333333" />
                ))}
              </Picker>
            </View>
          </View>

          <TouchableOpacity 
            style={styles.salvarBtn} 
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.salvarBtnText}>Salvar Alterações</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
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
    height: "80%",
    justifyContent: "space-evenly",
    flexDirection: "column",
    alignItems: "center",
  },
  contentInputs: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: "#fff"
  },
  input: {
    borderRadius: 8,
    marginBottom: 5,
    padding: 12,
    backgroundColor: "#ffffff",
    width: "90%",
    fontSize: 16,
    color: "#000000ff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    textAlign: 'left',
  },
  label: {
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    color: "#ffffff",
    fontSize: 16,
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
  salvarBtn: {
    flexDirection: 'row',
    backgroundColor: 'darkblue',
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  salvarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
    width: "90%",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    elevation: 1,
  },
  picker: {
    height: 50,
    width: '100%',
    color: "#333333",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  loadingText: {
    marginTop: 10,
    color: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  errorText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
  },
  backButton: {
    marginRight: 12,
    marginBottom: "2%",
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});