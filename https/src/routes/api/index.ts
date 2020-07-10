
import {ServerRequest} from '../../../deps.ts'

import ApiTest from './test.ts'
import Page404 from '../404.ts'

function ApiRootResponse(){
  return{
    status:200,
    body:`This is /api root response!`
  }
}

function methodNotSupported(){
  return{
    status:400,
    body:`Bad request: Method not supported`
  }
}

export default (req:ServerRequest)=>{
  switch(req.url.toLowerCase()){
    case "/api":
    case "/api/":
      if (req.method.toUpperCase() === "GET"){
        return req.respond(ApiRootResponse())
      } else {
        return req.respond(methodNotSupported())
      }
    case "/api/test":
      return ApiTest(req)
    default:
      return Page404(req)
  }
}

