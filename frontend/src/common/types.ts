export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export interface SignupType {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Login DTO
export interface LoginType {
  email: string;
  password: string;
}
