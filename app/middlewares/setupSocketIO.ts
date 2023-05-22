import { Server as WebSocketsServer, Socket } from 'socket.io';
import { ChatService } from '../enchufevirtual/chat/services/chat.service';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

export const setupSocketIO = (server) => {
  const io = new WebSocketsServer<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>(server, {
    cors: {
      origin: process.env.FRONTEND_URL
    }
  });
  const chatService = new ChatService();
  io.on('connection', (socket: Socket) => {

    socket.on('client:message', async (data) => {

      try {
        await chatService.create({
          username: data.from,
          message: data.body,
          image: data.image,
          userId: data.userId 
        });
      } catch (error) {
        throw new Error('Hubo un error al enviar el mensaje')
      }
      socket.broadcast.emit('server:message', {
        body: data.body,
        from: data.from,
        image: data.image,
        createAt: data.createAt
      });
    });
  });
};