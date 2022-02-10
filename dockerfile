FROM node:alpine

RUN mkdir -p /home/jf/Docker
WORKDIR /home/jf/Docker

COPY . /home/jf/Docker

RUN yarn install

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]