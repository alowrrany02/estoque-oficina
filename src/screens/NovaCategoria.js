// src/screens/NovaCategoria.js

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
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
    <View style={styles.container}>
      <Text style={styles.title}>Nova Categoria</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome da categoria"
        value={nome}
        onChangeText={setNome}
      />

      <TouchableOpacity style={styles.button} onPress={salvarCategoria}>
        <Ionicons name="save-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
