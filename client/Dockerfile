# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build
COPY . .
RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:1.27-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy your custom Nginx configuration
# Ensure the path use client/nginx.conf matches your folder structure
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Recommended command for Docker/K8s to keep the process in the foreground
CMD ["nginx", "-g", "daemon off;"]