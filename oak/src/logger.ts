
export default ({request}:{request:any},next:any)=>{
  console.log(`${request.url}...${request.method}`)
  next()
}