# Frontend Dockerfile for React/Vite
# Build Stage
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest and build
COPY . .
RUN yarn build

# Final Stage (Static Hosting with Nginx)
FROM nginx:stable-alpine AS runtime

# Copy build artifacts to Nginx html directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
