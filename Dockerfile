FROM node:18-alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci

EXPOSE 3000

CMD ["sh", "-c", "npx prisma generate && npm run build && npm run start"]