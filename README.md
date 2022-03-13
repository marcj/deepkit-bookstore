# Deepkit Bookstore Example

Little example to demonstrate Deepkit API Console.

This application is deployed at https://deepkit-bookstore.herokuapp.com/api. It uses Heroku Free Dynos,
so it might be a bit slow and takes a while on first request.

### Install

```
npm i
npm run start
```


Then open one of:

- https://127.0.0.1:8080/
- https://127.0.0.1:8080/api
- https://127.0.0.1:8080/_debug/

### Docker build

```
docker build -t deepkit-bookstore .

docker run --rm -p 8080:8080 -e PORT=8080 deepkit-bookstore
```

then open https://127.0.0.1:8080/
