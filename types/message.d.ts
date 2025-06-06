interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  receivedAt?: Date;
  readAt?: Date;
  sender: Pick<User, "email" | "username" | "id">;
  roomId: string;
  room: Room;
}
