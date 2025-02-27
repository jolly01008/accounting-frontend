FROM node:14
LABEL jo="<jollgmll292@gmail.com>"
RUN apt-get update
WORKDIR /app/side-project/accounting-project
COPY package*json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]
