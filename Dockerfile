FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code (though docker-compose will mount it too)
COPY . .

# Expose Vite default port
EXPOSE 3000

# Start in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
