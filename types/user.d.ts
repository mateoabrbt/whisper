interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  refreshToken?: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
  messagesSent: Message[];
  rooms: Room[];
}
