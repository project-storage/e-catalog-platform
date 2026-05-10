# Stage 1: Base image
FROM node:20-alpine AS base
WORKDIR /app
# Install build dependencies for native modules like bcrypt
RUN apk add --no-cache python3 make g++
COPY package*.json ./

# Stage 2: Development image
FROM base AS development
RUN npm install
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

# Stage 3: Build stage for production
FROM base AS build
RUN npm install --only=production
COPY . .

# Stage 4: Production image
FROM node:20-alpine AS production
WORKDIR /app
# Only copy the built app and production dependencies
COPY --from=build /app .
EXPOSE 8080
CMD ["node", "src/server.js"]
