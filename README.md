# in.orbit (Back-end)

O in.orbit é um gerenciador de metas desenvolvido durante uma "Next Level Week", um evento gratuito da [Rocketseat 🚀](https://www.rocketseat.com.br).

Essa aplicação foi criada com intuito exclusivo de aprendizado e aprimoramento 😎.

![App Screenshot](./screenshot.png)
## Stack utilizada

**Front-end:** React, Typescript, TailwindCSS, Zod, TanStack Query (React Query), React Hook Form, Vite.

**Back-end:** Node, Typescript, Fastify, Zod, Drizzle ORM, PostgreSQL (com Docker).


## Inicializando localmente o Back-end
- Instale o [Node.js](https://nodejs.org/pt/download/package-manager) (v20.17 ou superior)
- Instale o [Docker Desktop](https://www.docker.com/products/docker-desktop/) (idealmente, na v4.32 ou superior)

Clone o projeto:
```bash
  git clone https://github.com/cicero-mello/in.orbit-node.git
```

Entre no diretório do projeto:
```bash
  cd in.orbit-node
```

Instale as dependências:
```bash
  npm install
```

Com o Docker Desktop aberto, inicie o container da aplicação:
```bash
  docker compose up -d
```

Faça a migração para com que as tabelas sejam criadas no DB:
```bash
  npx drizzle-kit migrate
```

Inicie o servidor:
```bash
  npm run dev
```

Por fins de curiosidade, para checar os status das tabelas no banco de dados, abra um novo terminal e execute:
```bash
  npx drizzle-kit studio
```
...e então navegue para a url retornada.

## Inicializando localmente o Front-end
Basta seguir as instruções que estão no repositório
[in.orbit-react](https://github.com/cicero-mello/in.orbit-react).