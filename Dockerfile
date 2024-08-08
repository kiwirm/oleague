FROM --platform=linux/amd64 node:18-alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci

EXPOSE 3000

RUN chmod +x entrypoint.sh

CMD ["sh", "-c", "npx prisma generate && npm run build && npm run start"]