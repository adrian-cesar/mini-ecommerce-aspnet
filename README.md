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

- **RNF01** – O sistema deve utilizar arquitetura MVC  
- **RNF02** – O sistema deve ser uma aplicação web monolítica  
- **RNF03** – O sistema deve utilizar autenticação via JWT  
- **RNF04** – O sistema deve utilizar banco de dados relacional  
- **RNF05** – O sistema deve possuir testes unitários básicos  

---

# 🏗 4. Arquitetura  

O sistema será desenvolvido utilizando **arquitetura monolítica** com padrão **MVC (Model-View-Controller)**.

### Separação em camadas:

- **Controllers** → Responsáveis pelas rotas e controle das requisições HTTP  
- **Services** → Implementação das regras de negócio  
- **Repositories** → Camada de acesso ao banco de dados  
- **Models** → Representação das entidades do sistema  
- **Views (Razor)** → Camada de apresentação (interface com o usuário)  

Essa organização garante separação de responsabilidades e melhor manutenção do sistema.

---

# 🛠 5. Tecnologias Utilizadas e Justificativas  

🔹 ASP.NET Core  
Framework para desenvolvimento de aplicações Web em C#.  
**Justificativa:** Framework moderno, robusto, multiplataforma e amplamente utilizado no mercado.

---

🔹 Next.js  
Framework React para desenvolvimento de aplicações web com renderização híbrida (SSR e SSG).  
**Justificativa:** Permite melhor desempenho, SEO otimizado e organização eficiente do frontend.

---

🔹 TypeScript  
Superset do JavaScript com tipagem estática.  
**Justificativa:** Ajuda a evitar erros, melhora a legibilidade do código e facilita a manutenção do projeto.

---

🔹 Entity Framework Core  
ORM para comunicação com banco de dados.  
**Justificativa:** Permite mapear classes para tabelas de forma simples e organizada, facilitando persistência de dados.

---

🔹 PostgreSQL  
Banco de dados relacional.  
**Justificativa:** Armazenamento persistente, seguro e estruturado das informações do sistema.

---

🔹 JWT (Json Web Token)  
Autenticação baseada em token.  
**Justificativa:** Permite controle de acesso seguro às rotas protegidas da aplicação.

---

🔹 xUnit  
Framework para testes unitários.  
**Justificativa:** Garantir confiabilidade e validação das regras de negócio.

---

🔹 Padrões de Projeto (GoF)

Serão aplicados:

- **Strategy** → Para implementação das diferentes formas de pagamento  
- **Facade** → Centralização da lógica da venda no serviço responsável  
- Singleton** → Utilização na configuração e injeção de dependências  

Justificativa:** Aplicação de boas práticas conforme literatura clássica de Engenharia de Software.

---

🔄 6. Funcionalidades Principais  

✅ CRUD
- Produto  
- Cliente  

✅ Transação
- Venda com validação de estoque e atualização automática  

---

📅 7. Organização das Tarefas  

🔹 Adrian
- Estrutura do projeto  
- Backend (Controllers, Services, Repositories)  
- Configuração do banco  
- Implementação da autenticação JWT  
- Implementação dos padrões de projeto  

🔹 Renato
- Desenvolvimento do Front-end (Razor + Bootstrap)  
- Integração com a API  
- Documentação  
- Testes e validação  
- Auxílio na modelagem do banco  
