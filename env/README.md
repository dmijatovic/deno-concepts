# DENO env module

This section expolre DENO.env module. Official documentation [is here](https://doc.deno.land/https/github.com/denoland/deno/releases/latest/download/lib.deno.d.ts#Deno.env).

## Bare metal solution

You can pass env variables during start of deno

```bash
# pass env variables via bash (OK if there are few)
CERT_FILE="./cert/server.crt" KEY_FILE="./cert/server.pem" deno run --allow-env mod.ts

```

## Docker-compose

With docker-compose we can pass enviroment variables using env section.
