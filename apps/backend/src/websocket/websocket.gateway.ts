import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/socket.io', cors: true })
export class AppWebsocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection() {
    // sessão autenticada será validada em middleware dedicado nas próximas etapas
  }

  emitInboundMessage(payload: unknown) {
    this.server.emit('message.inbound', payload);
  }

  emitOutboundStatus(payload: unknown) {
    this.server.emit('message.status', payload);
  }

  emitConversationUpdated(payload: unknown) {
    this.server.emit('conversation.updated', payload);
  }
}
