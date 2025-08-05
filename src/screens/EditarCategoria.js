import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ActivityIndicator,ImageBackground
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

export default function EditarCategoria({ route, navigation }) {
  // Extração segura do ID da categoria
  const categoriaId = route.params?.categoriaId || '';
  
  // Estados do componente
  const [nome, setNome] = useState('');
  const [nomeOriginal, setNomeOriginal] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Carrega os dados da categoria ao montar o componente
  useEffect(() => {
    const carregarCategoria = async () => {
      if (!categoriaId) {
        setError('ID da categoria não fornecido');
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'categorias', categoriaId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setNome(data.nome || '');
          setNomeOriginal(data.nome || '');
        } else {
          setError('Categoria não encontrada');
        }
      } catch (err) {
        console.error('Erro ao carregar categoria:', err);
        setError('Erro ao carregar dados da categoria');
      } finally {
        setLoading(false);
      }
    };

    carregarCategoria();
  }, [categoriaId]);

  const handleSalvar = async () => {
    // Validações
    if (!nome.trim()) {
      Alert.alert('Atenção', 'Por favor, informe um nome para a categoria');
      return;
    }

    if (nome === nomeOriginal) {
      Alert.alert('Atenção', 'Nenhuma alteração foi feita no nome');
      return;
    }

    if (!categoriaId) {
      Alert.alert('Erro', 'ID da categoria não encontrado');
      return;
    }

    try {
      setSaving(true);
      
      const categoriaRef = doc(db, 'categorias', categoriaId);
      await updateDoc(categoriaRef, { 
        nome: nome.trim(),
        atualizadoEm: new Date() 
      });

      Alert.alert('Sucesso', 'Categoria atualizada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Erro ao atualizar categoria:', err);
      Alert.alert('Erro', 'Não foi possível salvar as alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976d2" />
        <Text style={styles.loadingText}>Carregando categoria...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
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
    <View style={styles.container}>
      <View style={styles.content}>
      <Text style={styles.title}>Editar Categoria</Text>
      
      <Text style={styles.originalName}>
        Nome atual: <Text style={styles.originalNameValue}>{nomeOriginal}</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Novo nome:</Text>
        <TextInput
          value={nome}
          onChangeText={setNome}
          placeholder="Digite o novo nome"
          style={styles.input}
          maxLength={50}
          editable={!saving}
        />
      </View>

      <TouchableOpacity
        onPress={handleSalvar}
        style={[
          styles.saveButton,
          saving && styles.saveButtonDisabled
        ]}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        )}
      </TouchableOpacity>
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
    height: "50%",
    justifyContent:"space-evenly",
    flexDirection:"column",
    alignItems:"center",
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
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
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#e53935',
    textAlign: 'center',
    marginBottom: 20,
  },
 
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  originalName: {
    fontSize: 16,
    marginBottom: 15,
    color: '#fff',
  },
  originalNameValue: {
    fontWeight: 'bold',
    color: '#fff',
  },
  inputContainer: {
    marginBottom: 25,
     width: "90%",
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  saveButton: {
    backgroundColor: 'darkblue',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: 'darkblue',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});