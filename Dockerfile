FROM node:18.10.0

WORKDIR /usr/src/app

COPY ./package*.json ./

# RUN npm install yarn -g

RUN yarn install

# RUN npm install typescript@4.7.4 -g

COPY . .

RUN yarn build

#RUN npm install pm2 -g

#RUN yarn global add pm2

RUN chmod +x dist/main.js

#CMD ["pm2-runtime","start","dist/apps/app/main.js ","--name=health_gorila"]

#CMD ["node","dist/apps/app/main.js"]
CMD ["yarn", "start:prod"]