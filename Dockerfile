FROM node:21.6-alpine as buildContainer
RUN mkdir /app
WORKDIR /app
ADD src src
ADD public public
ADD package.json .
ADD tsconfig.json .
RUN npm install
RUN npm run build
FROM nginx
COPY --from=buildContainer /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]