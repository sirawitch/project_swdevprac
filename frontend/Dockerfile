# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy files
COPY . .

# Install dependencies
RUN npm install

# Expose frontend port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]