# Build stage
FROM --platform=linux/amd64 node:20-slim as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/amd64 node:20-slim

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/build ./build
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "build"]
