import { Body, Controller, Headers, Post } from '@nestjs/common';
import { InboundMessageDto } from './dto/inbound-message.dto';
import { MessageStatusDto } from './dto/message-status.dto';
import { InternalService } from './internal.service';

@Controller('internal/messages')
export class InternalController {
  constructor(private readonly internalService: InternalService) {}

  @Post('inbound')
  inbound(@Headers('x-internal-token') token: string | undefined, @Body() dto: InboundMessageDto) {
    this.internalService.assertInternalToken(token);
    return this.internalService.ingestInboundMessage(dto);
  }

  @Post('status')
  status(@Headers('x-internal-token') token: string | undefined, @Body() dto: MessageStatusDto) {
    this.internalService.assertInternalToken(token);
    return this.internalService.updateMessageStatus(dto);
  }
}
