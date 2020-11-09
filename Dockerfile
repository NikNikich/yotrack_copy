FROM node:13.14


# copy build
WORKDIR /devel
COPY package.json .
COPY yarn.lock .
RUN yarn install
COPY . .

# build and start
RUN yarn run build

CMD ["yarn", "run", "start"]
