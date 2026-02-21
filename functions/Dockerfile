FROM node:20-alpine

WORKDIR /app

# Install dependencies dulu (cache layer)
COPY package.json ./
RUN npm install --omit=dev

# Copy semua kode
COPY . .

CMD ["node", "index.js"]
