set -e

docker buildx build --platform linux/amd64 --memory 4gb -t deepkit-bookstore .
docker tag deepkit-bookstore registry.heroku.com/deepkit-bookstore/web
docker push registry.heroku.com/deepkit-bookstore/web
heroku container:release web
