FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/worker/package.json apps/worker/package.json
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm --filter @apps/worker build
CMD ["node", "apps/worker/dist/index.js"]
