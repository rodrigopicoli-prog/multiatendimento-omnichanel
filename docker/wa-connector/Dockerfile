FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-workspace.yaml turbo.json tsconfig.base.json ./
COPY apps/wa-connector/package.json apps/wa-connector/package.json
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm --filter @apps/wa-connector build
EXPOSE 4010
CMD ["node", "apps/wa-connector/dist/index.js"]
