import { Server as WebSocketsServer, Socket } from 'socket.io';
import { ChatService } from '../enchufevirtual/chat/services/chat.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import * as http from 'http';
import { ClientMessageData } from '../../types/types';

export const setupSocketIO = (server: http.Server) => {
  const io = new WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>(server, {
    cors: {
      origin: process.env.FRONTEND_URL
    }
  });
  const chatService = new ChatService();
  
  io.on('connection', (socket: Socket) => {
    socket.on('error', (error: Error) => {
      socket.emit('error', error)
    });

    socket.on('client:message', async (data: ClientMessageData) => {
      try {
        await chatService.create({
          message: data.body,
          userId: data.userId 
        });

        socket.broadcast.emit('server:message', {
          body: data.body,
          from: data.from,
          name: data.name,
          image: data.image,
          userId: data.userId, 
          createAt: data.createAt
        });
      } catch (error) {
        throw new Error('Hubo un error al guardar el mensaje')
      }
    });
  });
};