FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/config/package.json packages/config/package.json
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm prisma generate --schema prisma/schema.prisma
RUN pnpm --filter @apps/backend build
EXPOSE 4000
CMD ["node", "apps/backend/dist/main.js"]
