// =====================
// AUTENTICAÇÃO
// =====================

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
}

// =====================
// PRODUTOS
// =====================

export interface Product {
  id: number;
  nome: string;
  preco: number;
  estoque: number;
  descricao?: string;
  categoria?: string;
  categoriaId?: number | null;
  imagemUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductRequest {
  nome: string;
  preco: number;
  estoque: number;
  descricao?: string;
  categoriaId?: number | null;
  imagemUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateProductRequest extends CreateProductRequest {}

// =====================
// CATEGORIAS
// =====================

export interface Category {
  id: number;
  nome: string;
  imagemUrl?: string;
}

export interface CreateCategoryRequest {
  nome: string;
  imagemUrl?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateCategoryRequest extends CreateCategoryRequest {}

// =====================
// CLIENTES
// =====================

export interface Client {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  nome: string;
  email: string;
  telefone?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateClientRequest extends CreateClientRequest {}

// =====================
// VENDAS
// =====================

export interface ItemVenda {
  id?: number;
  produtoId: number;
  produto?: Product;
  quantidade: number;
  precoUnitario: number;
}

export interface Sale {
  id: number;
  clienteId: number;
  cliente?: Client;
  dataVenda: string;
  total: number;
  itensVenda: ItemVenda[];
  createdAt?: string;
}

export interface CreateSaleRequest {
  clienteId: number;
  itens: Array<{
    produtoId: number;
    quantidade: number;
  }>;
}

// =====================
// API RESPONSES
// =====================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
