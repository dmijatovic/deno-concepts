
import {ServerRequest} from '../../../deps.ts'

export default (req:ServerRequest)=>{
  console.log("handle...", req.url)
  req.respond({
    status:200,
    body:`This is /api/test response!`
  })
}
