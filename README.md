This project is related with Spring backend application.
Please checkout the following link backend code.

### Backend code link
[Spring Boot Backend code](https://github.com/allthatjava/spring-boot-ecommerce)
___

### Dockerize the application
* Fill the Dockerfile something like followings
```
FROM nginx:1.17.1-alpine
COPY /dist/angular-ecommerce /usr/share/nginx/html
```

* To build docker image for the app
```
$ docker build -t angular-ecommerce .
 ```

* To run the application image on the docker
```
$ docker run -p 80:80 angular-ecommerce
```
