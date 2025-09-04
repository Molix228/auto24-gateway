FROM node:23-alpine as builder

WORKDIR /opt/app

ADD package.json yarn.lock ./

RUN yarn install --frozen-lockfile
ADD . .
RUN yarn build


FROM node:23-alpine
WORKDIR /opt/app
COPY package.json yarn.lock ./
RUN yarn install --only=production --frozen-lockfile 
COPY --from=builder /opt/app/dist ./dist
EXPOSE 3000
CMD [ "node", "dist/main.js" ]