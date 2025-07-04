FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY . .

RUN npx prisma generate

EXPOSE 3000

CMD sh -c "npx prisma db push && npm run seed && npm run dev"