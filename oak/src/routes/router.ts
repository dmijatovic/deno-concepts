import {Router} from "../../deps.ts"

import Home from "./home.ts"
import {apiGet, apiPost} from "./api.ts"

const router = new Router()

router.get("/",Home)
  .get("/api",apiGet)
  .post("/api/:id",apiPost)


export default router