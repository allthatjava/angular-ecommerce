This project is related with Spring backend application.
Please checkout the following link backend code.

### Backend code link
[Spring Boot Backend code](https://github.com/allthatjava/spring-boot-ecommerce)
___


* If you want to change the returnUrl by github login, go to __Settings > Developer settings > angular-ecommerce__ in github and update __Authorization callback URL__ as matching as `environment.ts` - __baseUrl__
---

### Dockerize the application
* Fill the Dockerfile something like followings
```
FROM nginx:1.17.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
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
