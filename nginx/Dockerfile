# ---------- Build frontend ----------
FROM node:18-alpine as builder
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend ./
RUN npm run build

# ---------- Production NGINX ----------
FROM nginx:alpine

# Copy custom NGINX config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy frontend build to NGINX public folder
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
