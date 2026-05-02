#base image
FROM node:20

#working directory creation inside container
WORKDIR /app

#copy package.json
COPY package*.json ./

#dependencies install
RUN npm install

#copy everything else
COPY . .

#expose the ports
EXPOSE 8001

#start the server
CMD ["node", "index.js"]
