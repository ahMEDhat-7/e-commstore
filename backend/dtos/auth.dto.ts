// Signup DTO
export class RegisterDto {
  username!: string;
  email!: string;
  password!: string;
}

// Login DTO
export class LoginDto {
  email!: string;
  password!: string;
}

// Auth Response DTO
export class AuthResponseDto {
  token!: string;
  user!: {
    id: string;
    username: string;
    email: string;
  };
}
