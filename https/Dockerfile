FROM hayd/alpine-deno:1.1.3

# working directory for the api
WORKDIR /home/deno/api

# use deno user created in the image
USER deno

# copy already compiled app
COPY ./dist ./cert/server.crt ./cert/server.pem  ./

# export port for this api
EXPOSE 8080

CMD ["run", "--allow-net","--allow-read","--allow-env","api.bundle.js"]

