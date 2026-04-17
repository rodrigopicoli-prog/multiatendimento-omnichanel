import fs from 'node:fs';
import path from 'node:path';
import { env } from '../../../../config/env';

export class SessionStore {
  constructor(private readonly basePath = env.WA_SESSIONS_PATH) {}

  ensureBasePath() {
    fs.mkdirSync(this.basePath, { recursive: true });
  }

  resolveSessionDir(tenantId: string, channelId: string) {
    const safeTenant = tenantId.replace(/[^a-zA-Z0-9-_]/g, '_');
    const safeChannel = channelId.replace(/[^a-zA-Z0-9-_]/g, '_');
    const fullPath = path.join(this.basePath, safeTenant, safeChannel);
    fs.mkdirSync(fullPath, { recursive: true });
    return fullPath;
  }
}
