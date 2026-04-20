import { Global, Module } from '@nestjs/common';
import { AppWebsocketGateway } from './websocket.gateway';

@Global()
@Module({
  providers: [AppWebsocketGateway],
  exports: [AppWebsocketGateway],
})
export class WebsocketModule {}
