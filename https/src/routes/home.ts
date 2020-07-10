
import {ServerRequest} from '../../deps.ts'

export default (req:ServerRequest)=>{
  console.log("HandleHomepage request")
  req.respond({
    status:200,
    body:"This is homepage response!"
  })
}

