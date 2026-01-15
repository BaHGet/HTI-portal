FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY package*.json ./
RUN npm install

COPY . .

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

RUN npm run build

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]