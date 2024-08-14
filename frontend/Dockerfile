# Stage 1: Build the React app using a Node.js image
FROM node:20.16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock) files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the built app using an NGINX server
FROM nginx:alpine

# Copy the build output from the previous stage to NGINX's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy a custom nginx configuration file (optional)
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
