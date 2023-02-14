FROM node: 14.20.1-bullseye-slim
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]
