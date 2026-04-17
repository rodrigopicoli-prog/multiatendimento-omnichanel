import type { WASocket } from '@whiskeysockets/baileys';
import type { SendMessageInput } from '../../../../dto/send-message.dto';

export class MessageSender {
  async send(socket: WASocket, payload: SendMessageInput) {
    const normalizedTo = payload.to.includes('@s.whatsapp.net') ? payload.to : `${payload.to}@s.whatsapp.net`;

    if (payload.type === 'TEXT') {
      return socket.sendMessage(normalizedTo, { text: payload.body ?? '' });
    }

    if (payload.mediaUrl) {
      return socket.sendMessage(normalizedTo, {
        caption: payload.body,
        document: { url: payload.mediaUrl },
      });
    }

    return socket.sendMessage(normalizedTo, { text: payload.body ?? '' });
  }
}
