import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

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
    <View style={styles.container}>
      <Text style={styles.header}>Editar Categoria</Text>
      
      <Text style={styles.originalName}>
        Nome atual: <Text style={styles.originalNameValue}>{nomeOriginal}</Text>
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Novo nome*</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  originalName: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  originalNameValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#555',
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
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#81c784',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});