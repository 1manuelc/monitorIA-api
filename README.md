# Backend MonitorIA

<div>
  <img src='https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white' alt='Node.js'>
  <img src='https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white' alt='TypeScript'>
  <img src='https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white' alt='Fastify'>
  <img src='https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white' alt='Prisma'>
  <img src='https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white' alt='Zod'>
  <img src='https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white' alt='PostgreSQL'>
</div>

Este projeto contém uma API robusta para a plataforma MonitorIA, fornecendo funcionalidades completas de gestão de usuários, autenticação, perguntas, respostas, respostas automáticas geradas por IA, tópicos e votação através de rotas bem definidas e documentadas.

## 📋 Funcionalidades

-   **Autenticação e Autorização**: Registro, login/logout e autenticação baseada em JWT com cookies seguros.
-   **Gestão de Usuários**: Criação, leitura, atualização e exclusão de usuários com diferentes papéis.
-   **Gerenciamento de Tópicos**: Criação e organização hierárquica de tópicos com relações pai-filho.
-   **Perguntas**: Criação, leitura, atualização e exclusão de perguntas com filtro por tópicos.
-   **Respostas**: Sistema completo de respostas com identificação de melhores respostas e sugestões de IA.
-   **Votação**: Sistema de votos upvote/downvote para perguntas e respostas com rastreamento de usuário.
-   **Inteligência Artificial**: Geração automática de sugestões de respostas para perguntas usando integração com Groq API.
-   **Validação de Dados**: Validação robusta de requisições e esquemas de resposta com Zod.
-   **Documentação Interativa**: Swagger/OpenAPI integrado com documentação automática de todas as rotas.
-   **Tratamento de Erros**: Exibição aprimorada de erros com mensagens descritivas.

## 🛠️ Implementação

A API foi desenvolvida com `Node.js` e construída utilizando `TypeScript + Fastify`, baseada nas seguintes dependências principais:

-   **`fastify`**: Framework web rápido e eficiente para construção da API.
-   **`prisma`**: ORM moderno para mapear o banco de dados PostgreSQL e fornecer operações simplificadas.
-   **`zod`**: Validação de tipos e esquemas de dados em requisições com segurança de tipo.
-   **`fastify-type-provider-zod`**: Integração entre Fastify e Zod para validação tipada.
-   **`@fastify/jwt`**: Plugin para autenticação baseada em JWT.
-   **`@fastify/cookie`**: Plugin para gerenciamento seguro de cookies.
-   **`@fastify/swagger` e `@fastify/swagger-ui`**: Documentação automática da API com interface Swagger.
-   **`bcrypt`**: Hash seguro de senhas.
-   **`dotenv`**: Gerenciamento de variáveis de ambiente.
-   **`tsx`**: Executor de arquivos TypeScript para desenvolvimento.
-   **Groq API**: Integração com IA para geração de sugestões de respostas baseadas em contexto.

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza PostgreSQL com Prisma como ORM. As principais entidades são:

-   **`app_user`**: Usuários da plataforma com autenticação (username, email, password, role).
-   **`question`**: Perguntas criadas pelos usuários com referência a tópicos.
-   **`answer`**: Respostas às perguntas com identificação de melhor resposta e sugestões de IA.
-   **`topic`**: Tópicos para organização hierárquica de perguntas (suporta subtópicos).
-   **`vote`**: Sistema de votação para perguntas e respostas.

## 📡 Rotas e Módulos

### Autenticação (`/api/auth`)

-   `POST /register` - Registro de novo usuário
-   `POST /login` - Autenticação e obtenção de token JWT
-   `DELETE /logout` - Logout e remoção do token de acesso (autenticado)

### Usuários (`/api/users`)

-   `GET /` - Listar todos os usuários (autenticado)
-   `GET /:id` - Obter usuário específico (autenticado)
-   `PATCH /:id` - Editar usuário específico (autenticado)
-   `DELETE /:id` - Deletar usuário específico (autenticado)

### Tópicos (`/api/topics`)

-   `GET /` - Listar todos os tópicos com hierarquia
-   `GET /:id` - Obter tópico específico
-   `POST /` - Criar novo tópico (autenticado)
-   `PATCH /:id` - Editar tópico específico (autenticado)
-   `DELETE /:id` - Deletar tópico específico (autenticado)

### Perguntas (`/api/questions`)

-   `GET /` - Listar todas as perguntas
-   `GET /:id` - Obter pergunta específica
-   `POST /` - Criar nova pergunta
-   `PATCH /:id` - Editar pergunta específica
-   `DELETE /:id` - Deletar pergunta específica

### Respostas (`/api/questions/:questionId/answers`)

-   `GET /` - Listar todas as respostas de uma pergunta
-   `GET /:answerId` - Obter resposta específica
-   `POST /` - Criar nova resposta para uma pergunta
-   `PATCH /:answerId` - Editar resposta específica
-   `DELETE /:answerId` - Deletar resposta específica

### Votos (`/api/votes`)

-   `GET /` - Listar votos ou obter total de votos (com query string para filtro)
-   `POST /` - Criar voto em pergunta ou resposta
-   `PATCH /:id` - Editar voto específico
-   `DELETE /:id` - Deletar voto específico

### Inteligência Artificial (`/api/ai`)

-   `POST /suggest/:questionId` - Gera uma sugestão automática de resposta de IA para uma pergunta específica utilizando o contexto da pergunta e seu tópico

## 🚀 Executando Localmente

Para executar a API, você precisa:

### 1. Clonar o repositório

```bash
git clone https://github.com/1manuelc/monitorIA-api.git
cd monitorIA-api
```

### 2. Instalar as dependências

```bash
npm install
# ou
pnpm install
# ou
yarn install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/monitoria"
JWT_SECRET="sua-chave-secreta-jwt"
COOKIE_SECRET="sua-chave-secreta-cookie"
GROQ_API_KEY="sua-chave-api-groq"
LOGGER_LEVEL="info"
```

### 4. Configurar o banco de dados

Execute as migrações do Prisma para criar as tabelas:

```bash
npx prisma migrate dev --name init
```

Alternativamente, você pode inicializar o banco executando o script `db.sql` presente na raiz do projeto. Esse script contém o schema inicial e dados de exemplo — use apenas um dos métodos (migrações ou `db.sql`) para evitar conflitos.

Exemplos de uso:

```bash
# executando com uma connection string (URI)
psql "postgresql://usuario:senha@localhost:5432/monitoria" -f db.sql
```

Observação: o comando `psql` deve estar instalado no seu sistema e a string de conexão deve conter credenciais válidas.

### 5. Executar em modo desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3000/api/`

### 6. Acessar a documentação

A documentação interativa estará disponível em `http://localhost:3000/docs`

## 📦 Scripts Disponíveis

-   `npm run dev` - Inicia a API em modo desenvolvimento com hot-reload
-   `npm run build` - Compila o projeto TypeScript para JavaScript
-   `npm start` - Inicia a API em modo produção (requer compilação prévia)

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) armazenados em cookies seguros para autenticação.

**Fluxo de autenticação:**

1. Usuário faz registro via `POST /api/auth/register`
2. Usuário faz login via `POST /api/auth/login` - um cookie com o token JWT é retornado
3. O token é enviado automaticamente em requisições subsequentes
4. Rotas protegidas verificam o token antes de processar a requisição
5. Logout via `DELETE /api/auth/logout` remove o token

## 📝 Validação de Dados

Todas as requisições são validadas usando Zod, com schemas definidos em cada módulo. Os erros de validação retornam mensagens claras e estruturadas.

## 🌐 CORS

O projeto inclui suporte a CORS via `@fastify/cors` para aceitar requisições de diferentes origens.

## 📚 Documentação

A API inclui documentação automática via Swagger/OpenAPI. Acesse `/docs` para explorar todas as rotas, seus parâmetros, corpo das requisições e respostas esperadas.

## 👤 Autor

[@1manuelc](https://github.com/1manuelc)

## 📄 Licença

MIT
