# server/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 8000

# Start the server
CMD ["npm", "start"]