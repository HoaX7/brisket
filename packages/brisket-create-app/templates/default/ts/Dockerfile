# To analyze docker images use the command: dive <image>
# this will help you reduce docker image size
# Adjust VERSION as desired
ARG NODE_VERSION=20.18.0
ARG ALPINE_VERSION=3.20
# Find your node version checksum here: https://nodejs.org/download/release/
FROM alpine:${ALPINE_VERSION} AS base

RUN apk add nodejs

# Node.js app lives here
WORKDIR /app

# Set environment
ENV NODE_ENV=development

# Throw-away build stage to reduce size of final image
FROM base AS build

RUN apk add npm

# Install node modules
COPY package-lock.json package.json ./
RUN npm ci --include=dev

# # Copy application code
COPY . .

# Build application
RUN npm run build

# Remove development dependencies
RUN npm prune --omit=dev

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/dist
COPY --from=build /app/package.json /app/package.json

EXPOSE 3000
CMD ["node", "-r", "dotenv/config", "dist/server.js"]