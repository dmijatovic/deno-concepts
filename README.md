# Deno playground

This repo is created based on Deno Udemy training.

## Installation

```bash
# install deno on linux/mac
curl -fsSL https://deno.land/x/install/install.sh | sh

# add DENO to PATH ()
# I added to your .profile file
export DENO_INSTALL="/home/dusan/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

# install VSC plugin

```

- Install DENO VSC plugin

## Basic DENO commands

```bash
# show all options
deno --help

# run app
deno run <fileName>

# installation so it can be runned
deno install <file>
# see options for installation
deno install --help

# upgrade deno
deno upgrade

```

## Third party modules

On DENO website there is a list of [third party modules](https://deno.land/x). You can also use [Pika CDN](https://www.pika.dev/cdn) as it seems to be first to host DENO modules.

### Caching

The external dependecies are downloaded and cached after first execution. In the documentation it is stated that [modules are cached](https://deno.land/manual/linking_to_external_code) in the $DENO_DIR folder. Depending on OS this is different location. You can change the location by changin $DENO_DIR value.

It might be beneficial to keep project dependecies in the local deno_dir folder. To do this

```bash
# create directory in your project
mkdir deno_dir
# set $DENO_DIR (temporary)
export DENO_DIR="./deno_dir"
# run deno to cache files
deno cache mod.ts

```

### Managing versions

To select specific version of the module you specify version in the url. On github you can see what version branches are created for a specific module. In the caching folder the example downloads the latest version (if no version is specified), otherwize you specify it in url using `@<version-number>`

```Javascript
// importing specific version @0.60.0
import {assert} from "https://deno.land/std@0.60.0/testing/asserts.ts"

```

### Managing dependencies

The advices approach about managing dependencies is to use `deps.ts` file as a list of all external dependencies for a module. Then in the module we do export from deps.ts file.
See caching folder.

```javascript
// deps.ts file
// exports all dependencies
export { assert, assertEquals } from "https://deno.land/std@0.60.0/testing/asserts.ts"

// in your file you importing from local dept.ts file
import {assertEquals} from "./dept.ts"

```

### Locking dependecies

Official documentation about [locking dependencies files](https://deno.land/manual/linking_to_external_code/integrity_checking).

```bash
# Create/update the lock file "lock.json".
deno cache --lock=lock.json --lock-write deps.ts

```

## DENO tools

Main deno tools can be found on the [official repo](https://deno.land/manual/tools)

### [Bundling](https://deno.land/manual/tools/bundler)

```bash
# bundle github file to local bundle?!?
deno bundle https://deno.land/std/examples/colors.ts colors.bundle.js

# show dependencies
deno info template/mod.ts

```
