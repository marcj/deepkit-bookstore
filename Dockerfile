FROM node:16-alpine

RUN apk --no-cache add openssh g++ gcc git libgcc libstdc++ linux-headers make python3 libexecinfo-dev

WORKDIR /app

# first package manager stuff so installing is cached by Docker.
ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
RUN npm ci

ADD . /app

RUN ./node_modules/.bin/tsc

FROM node:16-alpine

WORKDIR /app

COPY --from=0 /app /app

EXPOSE 8080

CMD APP_FRAMEWORK_PORT=$PORT node dist/app.js server:start
