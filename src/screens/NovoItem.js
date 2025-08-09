// src/screens/NovoItem.js

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ImageBackground
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
    <ImageBackground 
              source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
              style={styles.fundo}
            >
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
      <Text style={styles.title}>Adicionar Novo Item</Text>
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
        onChangeText={setQuantidade}
      />

      <Text style={styles.label}>Valor (R$):</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor"
        placeholderTextColor="#666666"
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
            <Picker.Item label="Selecione uma categoria" value="" color="#666666" />
            {categorias.map((cat) => (
            <Picker.Item key={cat.id} label={cat.nome} value={cat.id} color="#333333" />
            ))}
        </Picker>
        </View>
        </View>


      <TouchableOpacity style={styles.salvarBtn} onPress={salvarItem}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.salvarBtnText}>Salvar Item</Text>
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
    justifyContent:"space-evenly",
    flexDirection:"column",
    alignItems:"center",
  },
  contentInputs:{
    width:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color:"#fff",
    marginTop:10,
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
    // Força o texto a ser escuro mesmo no modo escuro
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
  categoriaButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1976d2',
    marginBottom: 10,
    width:"90%"
  },
  categoriaSelecionada: {
    backgroundColor: '#1976d2',
  },
  categoriaText: {
    color: '#000',
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
    color: "#333333", // Força a cor do texto do picker
  },
  backButton: {
    marginRight: 12,
    marginBottom: "2%",
  },
});