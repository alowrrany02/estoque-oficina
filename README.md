
# Aplicativo de Estoque de Oficina — README

Um aplicativo mobile desenvolvido em React Native + Expo com integração ao Firebase Firestore, criado para controle de estoque de peças de uma oficina mecânica. O app permite autenticação, criação de categorias, cadastro de itens, edição, exclusão, busca e sincronização online entre dispositivos.

---

## Índice

1. Descrição do Projeto
2. Funcionalidades
3. Tecnologias Utilizadas
4. Pré-requisitos
5. Instalação
6. Como Rodar o Projeto
7. Rodar no Emulador ou Celular
8. Gerar APK (Build para Android)


---

## Descrição do Projeto

Este aplicativo permite organizar o estoque de peças de uma oficina de forma prática e moderna.
O usuário pode fazer login, criar categorias de peças, adicionar itens dentro das categorias, editar informações, excluir registros, realizar buscas, atualizar a lista com pull-to-refresh e sincronizar tudo automaticamente via Firebase Firestore.
Ideal para pequenas oficinas que precisam controlar peças, valores e quantidades de forma simples e eficiente.

---

## Funcionalidades

* Login com Firebase Authentication
* Menu principal intuitivo
* CRUD de categorias (criar, listar, editar e excluir)
* CRUD de itens
* Busca por categorias e itens
* Pull-to-refresh nas telas
* Ícone de voltar em todas as telas
* Dados sincronizados em tempo real com Firestore
* Suporte para rodar em múltiplos dispositivos
* Possibilidade de gerar APK para instalação em Android

---

## Tecnologias Utilizadas

* React Native
* Expo
* Firebase Authentication
* Firebase Firestore
* React Navigation
* JavaScript

---

## Pré-requisitos

Antes de instalar e rodar o projeto, você deve ter instalado:

* Node.js (versão LTS)
* Git
* Expo Go (no telefone Android ou iPhone)
* Android Studio (opcional – para rodar em emulador)

---

## Instalação


. Instalar dependências:

```
npm install
```

Se der erro de dependências:

```
npm install --legacy-peer-deps
```

---

## Como Rodar o Projeto

Dentro da pasta do projeto, execute:

```
npx expo start
```

O Expo irá abrir no navegador. Você pode:

* Pressionar "a" para abrir em um emulador Android
* Pressionar "w" para abrir no navegador
* Escanear o QR Code com o Expo Go para rodar no celular

---

## Rodar no Emulador ou Celular

### Rodar no celular

1. Instale o aplicativo "Expo Go"
2. Rode:

```
npx expo start
```

3. Escaneie o QR Code que aparece no terminal ou no navegador

### Rodar no emulador Android

1. Abra o Android Studio
2. Ligue o AVD (emulador Android)
3. Com o Expo rodando, pressione a tecla "a"

---

## Gerar APK (Build para Android)

1. Instale o EAS CLI:

```
npm install -g eas-cli
```

2. Faça login:

```
eas login
```

3. Configure o projeto:

```
eas build:configure
```

4. Gerar APK:

```
eas build -p android --profile preview
```

Ao finalizar, o Expo fornecerá um link para baixar o arquivo APK.

