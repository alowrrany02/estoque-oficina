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
    flexGrow: 1,// Opcional: overlay escuro para melhor legibilidade
    
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
    height: "70%",
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
    marginBottom: 25,
    textAlign: 'center',
    color:"#fff"
  },
  input: {
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    backgroundColor:"#fff",
    width:"90%"
  
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
    color:"#fff"
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
  width:"90%",
  backgroundColor:"#fff"
},
picker: {
  height: 50,
  width: '100%',
},
});
