# Stage 0, based on Node.js, to build and compile Angular
# FROM node:10.16-alpine as node
# WORKDIR /app
# COPY package*.json /app/
# RUN npm install
# COPY ./ /app/
# RUN npm run build:prod

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
# FROM nginx:1.14.0-alpine
# COPY --from=node /app/dist/ /usr/share/nginx/html
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.14.0-alpine
ADD ./dist/ /usr/share/nginx/html
ADD ./nginx.conf /etc/nginx/conf.d/default.conf