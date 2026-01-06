export interface Request {
  id: number;
  request: string;   // The user's query/message
  response: string;  // The AI's response
  chat_id: number;
  CreatedAt: string; // Go's time format
}

export interface Chat {
  id: number;
  user_id: number;
  topic: string;
  created_at: string;
  requests: Request[]; // The backend might return requests (messages) nested or we fetch them separately
}

export interface CreateChatResponse {
  id: number;
  topic: string;
}

export interface SendMessageResponse {
  response: string; // The AI text response
}
