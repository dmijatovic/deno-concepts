/**
 * Simple TLS server with DENO
 */

import {listenAndServeTLS } from '../deps.ts'
import {Router} from './routes/index.ts'

// const certFile:string = config().CERT_FILE
// const keyFile:string = config().KEY_FILE

const certFile:string = Deno.env.get("CERT_FILE") || "./cert/server.crt"
const keyFile:string = Deno.env.get("KEY_FILE") || "./cert/server.pem"

console.log("certFile...", certFile)
console.log("keyFile...", keyFile)

const options={
  hostname:"localhost",
  port:10443,
  certFile:certFile,
  keyFile: keyFile
}


console.log("Starting HTTPS server on ", options.port)

listenAndServeTLS(options, Router)
.then(()=>{
  console.log("Deno...returned from listenAndServe")
})
