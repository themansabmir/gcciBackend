# Stage 1: Build the TypeScript application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./
# COPY yarn.lock ./ # If you use yarn

# Install dependencies
RUN npm install --frozen-lockfile
# RUN yarn install --frozen-lockfile # If you use yarn

# Copy all source code
COPY . .

# Build the TypeScript application
# Assumes you have a "build" script in package.json that runs tsc
RUN npm run build
# RUN yarn build # If you use yarn

# Clean up dev dependencies and temporary build artifacts if necessary
# ENV NODE_ENV production
# RUN npm prune --production # This can reduce final image size
# RUN rm -rf node_modules && npm install --production # If you want to rebuild node_modules from scratch for production


# Stage 2: Create the final production image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
# Assuming your compiled JS is in 'dist'
# COPY --from=builder /app/src/types ./src/types # If you have custom d.ts files that need to be alongside compiled code

# Expose the port your app listens on (e.g., 3000, 8080)
EXPOSE 3000

# Set environment variables if needed (e.g., NODE_ENV)
ENV NODE_ENV production

# Command to run your application
# Make sure this points to your compiled JS entry point
CMD ["node", "dist/index.js"]