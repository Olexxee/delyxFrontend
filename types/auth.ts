export interface User {
  id: string;
  _id: string;
  username: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  verified: boolean;
  deviceTokens?: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
