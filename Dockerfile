# Step 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /

COPY package.json package-lock.json ./
RUN npm install

COPY . .
# RUN npm run build

# Step 2: Serve the React app with a lightweight web server
FROM nginx:alpine

# Install ModSecurity dependencies
RUN apk add --no-cache modsecurity-modules libmodsecurity libmodsecurity-rules \
    && mkdir -p /etc/nginx/modsecurity \
    && cp /etc/modsecurity/modsecurity.conf-recommended /etc/nginx/modsecurity/modsecurity.conf

# # Enable ModSecurity in Nginx
# RUN echo 'include /etc/nginx/modsecurity/modsecurity.conf;' >> /etc/nginx/nginx.conf

# Copy custom nginx config (if needed)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]