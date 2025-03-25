# Build Stage
FROM node:latest AS build

WORKDIR /myapp

COPY . .

RUN npm install

RUN npm run build

# Production Stage
FROM nginx:latest

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy React build to Nginx's HTML folder
COPY --from=build /myapp/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
