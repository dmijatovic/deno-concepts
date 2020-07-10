
import {ServerRequest} from '../../deps.ts'

import Home from './home.ts'
import Api from './api/index.ts'
import Page404 from './404.ts'

export function Router(req:ServerRequest){
  switch(true){
    case req.url.toLowerCase()==="/":
      return Home(req)
    case req.url.toLowerCase().includes("/api"):
      return Api(req)
    default:
      return Page404(req)
  }
}