#base image
FROM node:20
#working directory
WORKDIR /app

#copr package.json
COPY package*.json ./

#dependencies install
RUN npm install

#copy everything else like source cde
COPY . .

#expose
EXPOSE 5173

#start the sever
CMD ["npm", "run", "dev", "--", "--host"]
