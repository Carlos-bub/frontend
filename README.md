# Documentação do Sistema para Barbearias - Front-end

## Introdução

###  1. Objetivo
Sistema desenvolvido para barbearias de médio porte, que moderniza processos manuais como agendamentos, gestão de clientes e trazendo eficiência e organização.

### 1.2 Publico-Alvo

- Donos de barbearia que desejam otimizar seu fluxo de trabalho.
- Barbeiros que precisam de uma ferramenta simples para gerenciar serviços.
- Clientes que buscam agilidade no agendamento.

## 2.Funcionalidades Principais

### 2.1 Módulo de Agendaento

- Agendamento online por cliente.
- Visualização de hórarios disponiveis em calendario interativo.
- Notificações de agendamento via email.

### 2.2 Gestão de clientes
- Cadastro com nome, telefone, email e historico de serviços
- Filtros por frequência e preferências (Ex: "Corte + Barba")

### 2.3 Painel do Barbeiro (Administrador)
- Visualização e Gerenciamento da agenda diária/semanal
- Cadastro de novos Serviços
- Edição e Atualização de serviços
## 3.Tecnologias Utilizadas - Front-end
### 3.1 Visão Geral
#### HTML 5: Estrutura das páginas
#### CSS 3: Estilização
- Flexbox e Grid para layouts
- media queries para responsividade
- Váriaveis CSS para temas
#### JavScript 
- Vanila JS (sem frameworks)
- Fetch API para requisições
- LocalStorrage para dados locais
- FontAwesome: Ícones
- Google Fonts: Tipografia
## Paginas Principais
### Home Page(`index.html`)
- Banner principal com chamada para ação
- Lista de serviços
- Sobre a barbearia
- Formulario de Contato
- Mapa de Localização
- Links para redes sociais
### Agendamento (`views/public/agendamento.html`)
- Formulário de agendamento em etapa:
---
            1. Lista de serviços
            2. Escolha de data
            3. Seleção de horário
            4. Dados do cliente
- Validação em tempo real
- Feedback visual de disponibilidade
- confirmação por email
### Painel Admin(`views/admin/admin.html`)
- Dashboard com métricas
- Lista de Agendamentos
- Gerenciamento de serviços
- Filtros e busca
- Ações em lote
### Login(`views/auth/login.html`)
- Formulario de login
- Recuperação de senha
- Feedback de erros
- Redirecionamento seguro
## Componenetes JavaScript
### Agendamento (`agendamento.js`)

```javascript
verificarDisponibilidade(); //checa horários disponiveis
selecionaHorario(); //Gerencia seleção de horário
enviarAgendamento(); // Processa formulário
validarFormulario(); // Valida dados de entrada
```
### Agendamento (`Admin.js`)
```javascript
carregarAgendamentos(); // Lista agendamenos
exibirAgendamentos(); // Renderiza lista
atualizarStatus(); // Aplica filtros
filtrarAgendamentos(); // aplica filtros
gerenciarServicos(); // CRUD de serviços
```

### Auth (`auth.js`)
```javascript
login(); // processa login
verificarAutenticação(); // Valida token
logout(); // Encerra sessão
redirecionarSeguro(); // redireciona com base em permissões
```

## 📁 4.Estrutura de Pastas
### 4.1 **Front-end** (`frontend`)
```bash
├── src/                   # Código-fonte principal
│   ├── assets/            # Imagens, ícones, fonts
│   ├── css/               # Estilos globais
│   ├── js/                # Scripts JavaScript
│   ├── views/             # Telas/páginas
│   │   ├── admin/         # Painel administrativo
│   │   ├── agendamento/   # Página de agendamentos(obs:nome corrigido)
│   │   └── auth/          # Autenticação (login cadastro)
├── index.html             # Página inicial
├── package.json           # Dependências e scripts
├── netlify.toml           # Configuração do Netlify (deploy)
└── .gitignore             # Arquivos ignorados pelo Git
```
## Licença do Projeto
#### MIT License (Mais simples e permissiva)
- ✅Permite; Uso, modificação, distribuição e uso comercial
## Referências do Projeto

### Referências de Apoio
- Mermaid.js (2024)
Diagramas de arquitetura 🔗 mermaid.js.org
- ESLint
Padronização de código 🔗 eslint.org
- Postman API Network
Exemplos de APIs RESTful 🔗 postman.com

### Referências Técnicas
- JWT Handbook (Auth0, 2022)
Boas práticas para tokens 🔗 auth0.com/resources/ebooks/jwt-handbook
- Airbnb JavaScript Style Guide (2024)
Convenções de nomenclatura 🔗 github.com/airbnb/javascript
- Node.js Best Practices (Goldbergy, 2024)
Estrutura de pastas e error handling 🔗 github.com/goldbergyoni/nodebestpractices
