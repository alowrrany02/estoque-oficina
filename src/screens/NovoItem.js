// src/screens/NovoItem.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert
} from 'react-native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function NovoItem({ navigation }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [valor, setValor] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    const buscarCategorias = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'categorias'));
        const lista = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategorias(lista);
      } catch (error) {
        console.log('Erro ao buscar categorias: ', error);
      }
    };

    buscarCategorias();
  }, []);

  const salvarItem = async () => {
    if (!nome || !descricao || !quantidade || !valor || !categoriaSelecionada) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    try {
      await addDoc(collection(db, 'itens'), {
        nome,
        descricao,
        quantidade: parseInt(quantidade),
        valor: parseFloat(valor),
        categoriaId: categoriaSelecionada,
        criadoEm: new Date(),
      });

      Alert.alert('Item salvo com sucesso!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro ao salvar item: ' + error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Novo Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        keyboardType="numeric"
        value={quantidade}
        onChangeText={setQuantidade}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor (R$)"
        keyboardType="decimal-pad"
        value={valor}
        onChangeText={setValor}
      />

      <Text style={styles.label}>Selecione a Categoria:</Text>
        <View style={styles.pickerContainer}>
        <Picker
            selectedValue={categoriaSelecionada}
            onValueChange={(itemValue) => setCategoriaSelecionada(itemValue)}
            style={styles.picker}
        >
            <Picker.Item label="Selecione uma categoria" value="" />
            {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nome} value={cat.id} />
            ))}
        </Picker>
        </View>


      <TouchableOpacity style={styles.salvarBtn} onPress={salvarItem}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.salvarBtnText}>Salvar Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  categoriaButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginBottom: 10,
  },
  categoriaSelecionada: {
    backgroundColor: '#1976d2',
  },
  categoriaText: {
    color: '#000',
  },
  salvarBtn: {
    flexDirection: 'row',
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  salvarBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  pickerContainer: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  marginBottom: 20,
  overflow: 'hidden',
},
picker: {
  height: 50,
  width: '100%',
},
});
