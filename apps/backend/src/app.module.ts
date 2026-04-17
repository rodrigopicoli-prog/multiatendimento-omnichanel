import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WebsocketModule } from './websocket/websocket.module';
import { appConfig } from './common/config/app.config';
import { TenantsModule } from './tenants/tenants.module';
import { UsersModule } from './users/users.module';
import { QueuesModule } from './queues/queues.module';
import { ChannelsModule } from './channels/channels.module';
import { ContactsModule } from './contacts/contacts.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { InternalNotesModule } from './internal-notes/internal-notes.module';
import { TagsModule } from './tags/tags.module';
import { QuickRepliesModule } from './quick-replies/quick-replies.module';
import { AuditModule } from './audit/audit.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InternalModule } from './internal/internal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    PrismaModule,
    HealthModule,
    AuditModule,
    AuthModule,
    WebsocketModule,
    TenantsModule,
    UsersModule,
    QueuesModule,
    ChannelsModule,
    ContactsModule,
    ConversationsModule,
    MessagesModule,
    InternalNotesModule,
    TagsModule,
    QuickRepliesModule,
    DashboardModule,
    InternalModule,
  ],
})
export class AppModule {}
