import {Application} from "../deps.ts"

import router from './routes/router.ts'
import logger from './logger.ts'

const api = new Application()

const certFile:string = Deno.env.get("CERT_FILE") || "./cert/server.crt"
const keyFile:string = Deno.env.get("KEY_FILE") || "./cert/server.pem"

const options={
  port:8080,
  secure: true,
  certFile: certFile,
  keyFile: keyFile
}

console.log("Starting server...", options.port)

// use logger
api.use(logger)
// routes
api.use(router.routes())
// listen
await api.listen(options)