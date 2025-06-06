interface Room {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  users: User[];
  messages: Message[];
}
