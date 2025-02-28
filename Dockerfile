# Use official Node.js image as base
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the ports for frontend and backend
EXPOSE 3000 3010

# Start both the JSON server and the app
CMD ["sh", "-c", "npx json-server -H 0.0.0.0 -p 3010 -w ./db.json & npm start"]
