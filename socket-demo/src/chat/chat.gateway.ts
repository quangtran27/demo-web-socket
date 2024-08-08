import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

enum ChatEvent {
  JoinRoom = 'join-room',
  LeaveRoom = 'leave-room',
  SendMessage = 'send-message',
  ReceiveMessage = 'receive-message',
}

type JoinRoomPayload = {
  room: string;
  user: string;
};

type Message = {
  user?: string;
  type: string;
  content: string;
};

@WebSocketGateway(5001, { cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage(ChatEvent.JoinRoom)
  joinRoom(
    @MessageBody() payload: JoinRoomPayload,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(payload.room);
    this.server.to(payload.room).emit(ChatEvent.ReceiveMessage, {
      type: 'noti',
      content: `${payload.user} joined the room`,
    });
  }

  @SubscribeMessage(ChatEvent.LeaveRoom)
  leaveRoom(@MessageBody() room: string, @ConnectedSocket() client: Socket) {
    client.leave(room);
  }

  @SubscribeMessage(ChatEvent.SendMessage)
  sendMessage(@MessageBody() message: Message) {
    console.log(message);
    this.server.to('chat').emit(ChatEvent.ReceiveMessage, message);
  }
}
