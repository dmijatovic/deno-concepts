
import {ServerRequest} from '../../deps.ts'

export default (req:ServerRequest)=>{
  console.log("404 page request")
  req.respond({
    status:404,
    body:"404 - Page not found"
  })
}
