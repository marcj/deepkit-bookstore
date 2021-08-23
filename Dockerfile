FROM node:14-alpine

RUN apk --no-cache add g++ gcc git libgcc libstdc++ linux-headers make python3 libexecinfo-dev
RUN npm install -g npm@6

WORKDIR /app

# first package manager stuff so installing is cached by Docker.
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN npm ci

ADD . /app

RUN ./node_modules/.bin/tsc

FROM node:14-alpine

WORKDIR /app

COPY --from=0 /app /app

ENV APP_KERNEL_HOST=0.0.0.0
EXPOSE 8080

CMD APP_KERNEL_PORT=$PORT node dist/app.js server:start
