# Use official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files (including db.json and server.js)
COPY . .

# Expose the ports for frontend (3000) and backend (3010)
EXPOSE 3000 3010

# Start both the JSON server and the React app concurrently
CMD ["sh", "-c", "node server.js & npm start"]
