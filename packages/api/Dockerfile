# Stage 1: Build the NestJS application
FROM node:22-alpine AS builder

# Create app directory
WORKDIR /usr/src/app

# Copy monorepo root package files
COPY package*.json ./

# Copy API package files
COPY packages/api/package*.json ./packages/api/

# Install all dependencies
RUN npm install

# Copy API source code
COPY packages/api ./packages/api

# Build the API
WORKDIR /usr/src/app/packages/api
RUN npm run build

# Stage 2: Production image
FROM node:22-alpine

# Set production environment
ENV NODE_ENV=production

# Create app directory
WORKDIR /usr/src/app

# Copy package files and install only production deps
COPY packages/api/package*.json ./
RUN npm install --production

# Copy built output from builder
COPY --from=builder /usr/src/app/packages/api/dist ./dist

# Use non-root user
USER node

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "dist/main.js"]
