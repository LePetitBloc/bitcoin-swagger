FROM guzart/nginx-h5bp:stable-alpine

RUN apk add --update git \
&&  rm -rf /usr/share/nginx/html/* \
&&  git clone --depth 1 https://github.com/swagger-api/swagger-editor.git /usr/share/nginx/html/

WORKDIR /usr/share/nginx/html/

ADD ./docker/default /etc/nginx/sites-available
