# 📋 Kanban Workspace Pro

Uma aplicação web moderna de **Quadro Kanban** (estilo Trello) desenvolvida de raiz utilizando apenas tecnologias nativas do ecossistema web (**HTML5, CSS3 puro e JavaScript Vanilla**), sem dependências de frameworks ou bibliotecas externas.

![Badge HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![Badge CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![Badge JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![Badge Status](https://img.shields.io/badge/Status-Concluído-success?style=flat-square)

---

## ✨ Funcionalidades Principais

- **Gestão Completa de Tarefas (CRUD):** Criar, editar, visualizar e eliminar tarefas de forma dinâmica.
- **Categorização por Prioridade e Tags:** Identificação visual imediata através de etiquetas de prioridade (*Baixa, Média, Alta*) e tags personalizadas por categoria.
- **Drag and Drop Nativo:** Suporte total para arrastar e soltar cartões fluidamente entre as colunas (*"A Fazer"*, *"Em Progresso"* e *"Concluído"*), utilizando a API nativa de Drag & Drop do HTML5.
- **Filtros e Pesquisa em Tempo Real:** Pesquisa instantânea por título ou tag, com opções de filtragem rápida por nível de prioridade.
- **Persistência de Dados (`localStorage`):** O estado do quadro é guardado automaticamente no navegador, garantindo que as tarefas não se perdem ao atualizar a página.
- **Design Moderno (Glassmorphism & UI/UX):** Interface limpa, responsiva, com variáveis CSS customizadas e suporte a ecrãs de diferentes tamanhos (desktop e mobile).

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estrutura semântica avançada com atributos de acessibilidade e `draggable`.
- **CSS3:** Flexbox, CSS Grid, Variáveis CSS customizadas (*Custom Properties*), efeitos de transparência (*backdrop-filter*) e responsividade adaptativa.
- **JavaScript (ES6+):** Manipulação avançada do DOM, eventos de Drag & Drop, gestão de estado reativo e integração com a API de armazenamento local (`localStorage`).

---

## 📂 Estrutura de Ficheiros

O projeto está dividido de forma modular em três ficheiros principais:

```text
kanban-workspace/
│
├── index.html    # Estrutura HTML da aplicação e modais
├── style.css     # Estilos visuais, temas, cores e responsividade
└── script.js     # Lógica de negócio, Drag & Drop e localStorage
