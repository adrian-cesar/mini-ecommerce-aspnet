# 🛒 Mini E-commerce Web – ASP.NET Core  

## 👨‍💻 Integrantes  
- Adrian Gonçalves  
- Renato Colin Neto  

---

# 📌 1. Domínio do Problema  

Pequenas lojas precisam de um sistema simples para gerenciar seus produtos, clientes e vendas.

O sistema permitirá:

- Cadastro de produtos  
- Cadastro de clientes  
- Registro de vendas  
- Controle automático de estoque  
- Autenticação de usuários  

A cada venda realizada, o sistema deve verificar o estoque disponível e atualizar automaticamente as quantidades.

---

# 📋 2. Requisitos Funcionais (RF)

- **RF01** – O sistema deve permitir cadastro de produtos  
- **RF02** – O sistema deve permitir cadastro de clientes  
- **RF03** – O sistema deve registrar vendas  
- **RF04** – O sistema deve atualizar automaticamente o estoque após uma venda  
- **RF05** – O sistema deve permitir autenticação via login  

---

# 📋 3. Requisitos Não Funcionais (RNF)

- **RNF01** – O sistema deve utilizar backend em ASP.NET Core Web API  
- **RNF02** – O sistema deve utilizar frontend em Next.js  
- **RNF03** – O sistema deve utilizar autenticação via JWT  
- **RNF04** – O sistema deve utilizar banco de dados relacional  
- **RNF05** – O sistema deve possuir testes unitários básicos  
- **RNF06** – O sistema deve possuir CI/CD para build e testes automatizados  

---

# 🏗 4. Arquitetura  

O sistema é composto por duas partes principais:

- **Backend**: ASP.NET Core Web API
- **Frontend**: Next.js
- **Banco de dados**: PostgreSQL

### Separação no frontend:

O frontend reúne duas áreas distintas dentro do mesmo app Next.js:

- **Painel Administrativo** (`/login`, `/dashboard`, `/produtos`, `/categorias`, `/clientes`, `/vendas`) — acesso restrito a usuários com `role = admin`; permite CRUD de produtos, categorias e clientes, além de KPIs e gráficos de vendas no dashboard.
- **Loja (storefront)** (`/loja`, `/loja/produto/[id]`, `/loja/carrinho`, `/loja/checkout`, `/loja/login`, `/loja/meus-pedidos`) — acesso público para navegação, carrinho e checkout (inclusive como cliente guest, sem login); o histórico de pedidos exige autenticação.

Ambas as áreas compartilham a mesma tabela de usuários e o mesmo token JWT.

### Separação em camadas do backend:

- **Controllers** → Responsáveis pelas rotas e pelo tratamento das requisições HTTP  
- **Services** → Implementação das regras de negócio  
- **Repositories** → Camada de acesso ao banco de dados  
- **Models** → Representação das entidades do sistema  
- **DTOs** → Objetos de transferência usados nas entradas e saídas da API  

Essa organização garante separação de responsabilidades e facilita manutenção e testes.

---

# 🛠 5. Tecnologias Utilizadas e Justificativas  

🔹 **ASP.NET Core**  
Framework para desenvolvimento de aplicações Web em C#.  
**Justificativa:** Framework moderno, robusto, multiplataforma e amplamente utilizado no mercado.

---

🔹 **Next.js**  
Framework React para desenvolvimento de aplicações web com renderização híbrida (SSR e SSG).  
**Justificativa:** Permite melhor desempenho, SEO otimizado e organização eficiente do frontend.

---

🔹 **TypeScript**  
Superset do JavaScript com tipagem estática.  
**Justificativa:** Ajuda a evitar erros, melhora a legibilidade do código e facilita a manutenção do projeto.

---

🔹 **Entity Framework Core**  
ORM para comunicação com banco de dados.  
**Justificativa:** Permite mapear classes para tabelas de forma simples e organizada, facilitando persistência de dados.

---

🔹 **PostgreSQL**  
Banco de dados relacional.  
**Justificativa:** Armazenamento persistente, seguro e estruturado das informações do sistema.

---

🔹 **JWT (Json Web Token)**  
Autenticação baseada em token.  
**Justificativa:** Permite controle de acesso seguro às rotas protegidas da aplicação.

---

🔹 **xUnit**  
Framework para testes unitários.  
**Justificativa:** Garantir confiabilidade e validação das regras de negócio.

---

🔹 **Moq**  
Biblioteca de mock para testes unitários em .NET.  
**Justificativa:** Permite simular dependências (repositórios/serviços) e isolar a lógica testada com xUnit.

---

🔹 **Padrões Arquiteturais**

Aplicados no backend:

- **Repository** → `Repositories/` isola o acesso a dados via EF Core de cada entidade
- **Service Layer** → `Services/` concentra as regras de negócio (ex: `VendaService` valida estoque e centraliza a criação de vendas em uma transação)
- **DTO (Data Transfer Object)** → `Dtos/` define os formatos de entrada/saída da API, desacoplados dos models
- **Dependency Injection** → registro de serviços e repositórios no `Program.cs`

**Justificativa:** Separação de responsabilidades, testabilidade (uso de mocks com Moq) e manutenção facilitada.

---

# 🔄 6. Funcionalidades Principais  

✅ **CRUD (Painel Admin)**
- Produto  
- Categoria  
- Cliente  

✅ **Transação**
- Venda com validação de estoque e atualização automática  

✅ **Autenticação**
- Login/registro de cliente (`/loja/login`) e login de admin (`/login`), via JWT
- Checkout como cliente cadastrado ou como guest (sem login)

✅ **Loja (storefront)**
- Catálogo público com busca e filtro por categoria  
- Carrinho de compras e checkout em etapas  
- Histórico de pedidos do cliente autenticado (`/loja/meus-pedidos`)

✅ **Dashboard Administrativo**
- KPIs (receita total, itens vendidos, ticket médio, produtos ativos)  
- Gráficos de receita, vendas por categoria e top produtos  
- Alertas de estoque baixo/zerado

---

# 📅 7. Organização das Tarefas  

🔹 **Adrian**
- Estrutura do projeto  
- Backend (Controllers, Services, Repositories)  
- Configuração do banco  
- Implementação da autenticação JWT  
- Implementação dos padrões de projeto  

🔹 **Renato**
- Desenvolvimento do Front-end 
- Integração com a API  
- Documentação  
- Testes e validação  
- Auxílio na modelagem do banco  

---

# ▶ 8. Como Rodar o Projeto

Pré-requisitos:

- .NET 8 SDK
- Node.js 20+
- PostgreSQL

1. Instale e deixe o PostgreSQL rodando na porta `5432`.
2. Confira se a conexão em [appsettings.json](backend/MiniEcommerce/appsettings.json) está correta.
3. Ao subir o backend, o banco é criado e preenchido automaticamente com poucos dados de exemplo.

1. Backend (Terminal 1)

```bash
cd backend/MiniEcommerce
dotnet run
```

2. Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

3. Acessos

- API: http://localhost:5250
- Loja (público): http://localhost:3000/loja
- Painel Admin: http://localhost:3000/login (`admin@primebox.com` / `admin123`, criado automaticamente pelo seed)

---

# 🧪 9. Como Rodar os Testes

```bash
cd backend
dotnet test
```

Testes unitários (xUnit + Moq) cobrem `AuthService`, `VendaService`, `ProdutoService` e `ClienteService`.

---

# ⚙️ 10. CI/CD

Workflows configurados em `.github/workflows/`:

- **`backend-ci.yml`** — a cada push/PR: restaura, builda (`Release`) e executa `dotnet test` no backend.
- **`frontend-ci.yml`** — a cada push/PR: `npm ci`, lint (`eslint`) e `npm run build` no frontend.
