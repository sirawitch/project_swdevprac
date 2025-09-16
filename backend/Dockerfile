# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose backend port
EXPOSE 5001

# Start the backend dev server
CMD ["npm", "run", "dev"]