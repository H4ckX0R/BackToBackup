# Stage 1: Build the Angular application
FROM node:22-alpine AS builder

WORKDIR /usr/src/app

# Copy package files from monorepo root and frontend
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install all dependencies
RUN npm install

# Copy frontend source code
COPY packages/frontend ./packages/frontend

# Build the Angular app
WORKDIR /usr/src/app/packages/frontend
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine

# Copy built app to nginx
COPY --from=builder /usr/src/app/packages/frontend/dist/backtobackup-app/browser /usr/share/nginx/html

# Copy nginx configuration
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

