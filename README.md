🛒 Mini E-commerce Web – ASP.NET Core
-Integrantes

Adrian Gonçalves

Renato Colin Neto

📌 1. Domínio do Problema

Pequenas lojas precisam de um sistema simples para gerenciar seus produtos, clientes e vendas.

O sistema permitirá:

Cadastro de produtos

Cadastro de clientes

Registro de vendas

Controle automático de estoque

Autenticação de usuários

A cada venda realizada, o sistema deve verificar o estoque e atualizar automaticamente as quantidades disponíveis.

📋 2. Requisitos Funcionais (RF)

RF01 – O sistema deve permitir cadastro de produtos
RF02 – O sistema deve permitir cadastro de clientes
RF03 – O sistema deve registrar vendas
RF04 – O sistema deve atualizar automaticamente o estoque após uma venda
RF05 – O sistema deve permitir autenticação via login

📋 3. Requisitos Não Funcionais (RNF)

RNF01 – O sistema deve utilizar arquitetura MVC
RNF02 – O sistema deve ser uma aplicação web monolítica
RNF03 – O sistema deve utilizar autenticação via JWT
RNF04 – O sistema deve utilizar banco relacional
RNF05 – O sistema deve possuir testes unitários básicos

🏗 4. Arquitetura

O sistema será desenvolvido utilizando arquitetura monolítica com padrão MVC (Model-View-Controller).

Separação em camadas:

Controllers → Responsável pelas rotas da API

Services → Regras de negócio

Repositories → Acesso ao banco

Models → Entidades do sistema

🛠 5. Tecnologias Utilizadas e Justificativas
🔹 ASP.NET Core

Framework para desenvolvimento de aplicações Web em C#.
Justificativa: Framework moderno, robusto e amplamente utilizado no mercado.

🔹 Entity Framework Core

ORM para comunicação com banco de dados.
Justificativa: Permite mapear classes para tabelas de forma simples e organizada.

🔹 SQL Server / PostgreSQL

Banco de dados relacional.
Justificativa: Armazenamento persistente e seguro das informações.

🔹 JWT (Json Web Token)

Autenticação baseada em token.
Justificativa: Segurança e controle de acesso às rotas protegidas.

🔹 xUnit

Framework de testes unitários.
Justificativa: Garantir confiabilidade nas regras de negócio.

🔹 Padrões de Projeto (GoF)

Serão aplicados:

Strategy → Para formas de pagamento

Facade → Centralização da lógica de venda

Singleton → Configuração de serviços

Justificativa: Aplicação de boas práticas conforme literatura clássica de Engenharia de Software.

🔄 6. Funcionalidades Principais
CRUD

Produto

Cliente

Transação

Venda com validação de estoque e atualização automática

📅 7. Organização das Tarefas:
-Adrian

Estrutura do projeto

Backend (Controllers, Services, Repositories)

Configuração do banco

Implementação de autenticação JWT

Implementação dos padrões de projeto

-Renato

Desenvolvimento do Front-end

Integração com API

Documentação

Testes e validação

Auxílio na modelagem do banco
