// src/screens/NovaCategoria.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,ImageBackground } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // ajuste o caminho conforme seu arquivo

export default function NovaCategoria() {
  const [nome, setNome] = useState("");
  const navigation = useNavigation();

  const salvarCategoria = async () => {
    if (!nome.trim()) {
      Alert.alert("Erro", "O nome da categoria não pode estar vazio.");
      return;
    }

    try {
      await addDoc(collection(db, "categorias"), { nome });
      Alert.alert("Sucesso", "Categoria salva com sucesso!");
      setNome("");
      navigation.goBack(); // Volta para a tela anterior
    } catch (error) {
      Alert.alert("Erro", "Não foi possível salvar a categoria.");
      console.log(error);
    }
  };

  return (
      <ImageBackground 
        source={{ uri: 'https://images.unsplash.com/photo-1614850523011-8f49ffc73908?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXp1bCUyMGdyYWRpZW50ZXxlbnwwfHwwfHx8MA%3D%3D' }}
        style={styles.fundo}
      >    
      <View style={styles.container}>
      <View style={styles.content}>
      <Text style={styles.title}>Nova Categoria</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da categoria"
        placeholderTextColor="#666666"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={salvarCategoria}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Salvar</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    marginTop:30,
    marginRight: 12,

  },
  content: {
    borderColor: "#fff",
    borderWidth: 2,
    borderRadius: 8,
    width: "90%",
    height: "50%",
    paddingTop:"20%",
    alignItems:"center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color:"#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
    width:"90%",
    color: '#000000ff',
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "darkblue",
    padding: 15,
    borderRadius: 8,
    marginTop:10,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
