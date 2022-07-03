# stage1 - build react app first 
FROM node:lts-alpine3.15 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
COPY ./yarn.lock /app/

ENV GENERATE_SOURCEMAP=false
RUN yarn --silent
COPY . /app
#RUN yarn build
RUN NODE_OPTIONS="--max-old-space-size=8192" yarn build

# stage 2 - build the final image and copy the react build files
FROM nginx:1.21.6-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]