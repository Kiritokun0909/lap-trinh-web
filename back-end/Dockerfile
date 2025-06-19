# Use Node base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of backend files
COPY . .

# Expose backend port
EXPOSE 5000

# Run the backend server
CMD ["npm", "start"]
