# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# RUN npm run build

# Step 2: Serve the React app with a lightweight web server
FROM nginx:alpine

# Copy built React app to Nginx's default static folder
# COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]