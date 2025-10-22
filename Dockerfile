# Multi-Stage Build für wissen-handeln.com

# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Dependencies installieren
COPY package*.json ./
RUN npm ci

# Source code kopieren & bauen
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Built files kopieren
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx-Konfiguration (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
