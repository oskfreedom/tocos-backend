# Use the official Node.js 18 image with Alpine as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the Node.js dependencies
RUN npm install

# Copy all files from the current directory to the working directory in the container
COPY . .

# Expose port 8000 to allow external access to the application
EXPOSE 8000

# Command to start the application in development mode
CMD ["npm", "run", "dev"]