# Use Node.js
FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Open the port
EXPOSE 3000

# Start the development server (This is the important part!)
CMD ["npm", "start"]