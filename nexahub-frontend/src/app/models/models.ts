export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface RegisterRequest {
  nom: string;
  email: string;
  motDePasse: string;
  company: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nom: string;
  role: string;
  company: string;
}

export interface Permission {
  id: number;
  nom: string;
  description: string;
}

export interface Role {
  id: number;
  nom: string;
  description: string;
  permissions: Permission[];
}

export interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  actif: boolean;
  company: string;
  createdAt: string;
  role: Role;
}

export interface HistoriqueAction {
  id: number;
  utilisateur: Utilisateur;
  action: string;
  details: string;
  company: string;
  dateAction: string;
}