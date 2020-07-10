# HTTPS server with Deno

This is basic implementation of https server using DENO.

```bash
# run deno
deno run --allow-net --allow-read --allow-env ./src/server.ts

# build app in dist folder
# dist folder need to exist
deno bundle ./src/server.ts ./dist/api.bundle.js

# run build app
deno run --allow-net --allow-read --allow-env dist/api.bundle.js

```

The basic http module does not have router. All routing need to be done manually. It is lightweight but requires writing your own router. Writing full router will require some effort.

Currently most popular router for DENO is OAK. We will try thatone too.

## Dockerfile

At the moment DENO team is working on official DEMO dockerfile. Hayd is the person who has first working version on Alpine images. The size of the image is about 30MB. This is larger than Go Alpine image but less than NodeJS alpine image.

Compiled DENO app is usually small to the increase should not be huge. We test this with Docerfile in this project.

```bash
# build docker container
docker build . -t dv4all/deauth:v0.1

```

## Challenges with DENO in the container

I was able to run deno https server on localhost:10443 with self-singed certificate. But when using Dockerfile and docker-compose first challenge was that cert files could not be read by DENO. After using sudo user instead of created deno user the container comiled and service was started. Nevertheless serving of pages did not worked. The error was that connection was broken?
