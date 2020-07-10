// get deno directory
// console.log(Deno.env.get("DENO_DIR"))
// console.log("All", Deno.env.toObject())

console.log("CERT...", Deno.env.get("CERT_FILE")||"default value")
console.log("KEY...", Deno.env.get("KEY_FILE")||"default value")