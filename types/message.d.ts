interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: Pick<User, 'email' | 'username' | 'id'>;
  roomId: string;
  room: Room;
  status: MessageStatus[];
}

interface MessageStatus {
  id: string;
  userId: string;
  messageId: string;
  deliveredAt?: Date | null;
  readAt?: Date | null;
  createdAt: Date;
  user: Pick<User, 'email' | 'username' | 'id'>;
}
