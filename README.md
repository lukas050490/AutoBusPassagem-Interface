# 🚌 BusTicket Manager - Sistema de Autoatendimento e Gestão de Passagens



Sistema completo para autoatendimento de compra de passagens rodoviárias com painel administrativo hierárquico. O projeto simula todo o fluxo de compra (escolha de empresa, destino, horário, assentos, CPF e métodos de pagamento) e oferece uma camada administrativa robusta com níveis de acesso diferenciados.

![Dashboard Preview](https://github.com/lukas050490/AutoBusPassagem-Interface/blob/main/public/home%202026-03-19%20090949.png?raw=true)



## 🚀 Sobre o Projeto

O **BusTicket Manager** é uma aplicação full-stack desenvolvida para gerenciar a venda de passagens de ônibus de forma digital. Ele é composto por dois módulos principais:

1.  **Autoatendimento (Cliente)**: Interface pública onde o usuário final pode pesquisar viagens, selecionar assentos, informar CPF, revisar a compra e simular pagamento via cartão ou PIX.
2.  **Painel Administrativo**: Ambiente restrito com dois níveis de acesso:
    - **Super Admin**: Controle total sobre empresas, viagens e criação de outros administradores.
    - **Admin**: Gerenciamento exclusivo de viagens (criação, edição, cancelamento) sem acesso a dados sensíveis de empresas ou criação de novos usuários.

---

## ✨ Funcionalidades

### Módulo Cliente (Autoatendimento)
- ✅ Seleção de empresa de ônibus.
- ✅ Escolha de destino e horário disponível.
- ✅ Mapa interativo para seleção de assentos.
- ✅ Inserção de CPF do passageiro.
- ✅ Tela de revisão de dados antes da finalização.
- ✅ Simulação de pagamento (Cartão de Crédito/Débito e PIX) - *frontend apenas, sem integração com gateway real*.

### Módulo Administrativo
#### 🔐 Super Admin
- ➕ Criação, edição e remoção de empresas de ônibus.
- 👥 Criação e gerenciamento de administradores (nível `admin`).
- 🗺️ Criação e gerenciamento de destinos e rotas.
- 🚍 Gerenciamento completo de todas as viagens.
- 📊 Dashboard com visão geral do sistema.

#### 🛠️ Admin (Operador)
- 🚍 Gerenciamento de viagens (criação, alteração de horários, cancelamento).
- 👀 Visualização de empresas e destinos (sem permissão de edição).
- 📈 Dashboard focado nas viagens sob sua gestão.

---

## 🧱 Arquitetura e Tecnologias

### Backend
- **Node.js** com **Express** - API RESTful.
- **Sequelize** (ORM) - Modelagem e interação com o banco de dados.
- **PostgreSQL** - Banco de dados relacional.
- **JSON Web Token (JWT)** - Autenticação e autorização.
- **Docker** - Containerização do ambiente de desenvolvimento.
- **Beekeeper Studio** - Ferramenta recomendada para visualização do banco.

### Frontend
- **React** - Biblioteca para construção da interface.
- **Tailwind CSS** - Estilização utilitária e responsiva.
- **Axios** - Cliente HTTP para comunicação com a API.
- **UUID** - Geração de identificadores únicos.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)
- [Beekeeper Studio](https://www.beekeeperstudio.io/) (opcional, para gerenciar o banco)

---

## 🛠️ Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/busticket-manager.git
cd busticket-manager
