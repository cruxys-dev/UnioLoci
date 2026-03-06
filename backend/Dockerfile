# Backend Dockerfile for NestJS
# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (leverages Docker cache)
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the app and build
COPY . .
RUN yarn build

# Final Stage
FROM node:20-alpine AS runtime

WORKDIR /app

# Copy production artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "dist/main"]
