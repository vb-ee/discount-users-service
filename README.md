# Discounting Platform User Service

This is the User microservice for the Discounting Platform project. This service handles authentication logic for users and provides CRUD operations.

## Launching

### Build an image

Dev:

`docker build -t user-service -f Dockerfile.dev`

Prod:

`docker build -t user-service Dockerfile`

### Run the container

`docker run -d -p 8080:80 user-service`

If you want to run the entire project, please go to the [parent repository](https://github.com/vb-ee/discount-platform).
