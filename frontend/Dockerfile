FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*

RUN npm install -g serve

COPY package.json ./

RUN npm install 

COPY . .

ARG VITE_BASE_API_URL
ENV VITE_BASE_API_URL=$VITE_BASE_API_URL

RUN npm run build

EXPOSE 80

CMD ["serve", "-s", "dist", "-l", "80"]