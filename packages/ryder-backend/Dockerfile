FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY packages/ryder-backend/package.json ./packages/ryder-backend/

RUN npm ci -w @ryder/backend --omit=dev

COPY packages/ryder-backend ./packages/ryder-backend

WORKDIR /app/packages/ryder-backend

ENV NODE_ENV=production
RUN mkdir -p uploads

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:4000/api/health',r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "src/index.js"]
