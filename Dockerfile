FROM node:13.7.0-alpine

COPY ./ /app
WORKDIR /app
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]