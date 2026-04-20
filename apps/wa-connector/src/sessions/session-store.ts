import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env';

export class SessionStore {
  constructor(private readonly basePath = env.WA_SESSIONS_PATH) {}

  ensureBasePath() {
    fs.mkdirSync(this.basePath, { recursive: true });
  }

  getSessionPath(sessionId: string) {
    return path.join(this.basePath, sessionId);
  }
}
