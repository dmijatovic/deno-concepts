# OAK router with DENO

After working with basic http of DENO I decided to try oak router. This is most populair router at the time of testing (July 2020).

## Building

```bash
# run deno
deno run --allow-net --allow-read --allow-env ./src/server.ts

# build app in dist folder
# dist folder need to exist
deno bundle ./src/server.ts ./dist/api.bundle.js

# run build app
deno run --allow-net --allow-read --allow-env dist/api.bundle.js
```
