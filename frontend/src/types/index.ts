export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Chat {
  index: number; // Backend ส่งมาเป็น 'index' (จาก ChatResp struct)
  title: string;
}

export interface Message {
  index: number;
  role: 'user' | 'assistant';
  text: string;
  created_at: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}
