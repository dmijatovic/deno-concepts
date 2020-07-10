
const apiGet=(ctx:any)=>{
  ctx.response.body = "This is api GET"
}

const apiPost=({params, response}:{params:{id:string};response:any})=>{
  response.headers.set("Content-Type","application/json")
  response.status=200
  response.body = {message:`This is api POST for id: ${params['id']}`}
}

export {
  apiGet,
  apiPost
}