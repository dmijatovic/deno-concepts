
const hostname:string = "0.0.0.0";
const port:number = parseInt(Deno.args[0]) || 8080;

const listener = Deno.listen({ hostname, port });

console.log(`Listening on ${hostname}:${port}`);

for await (const conn of listener) {
  Deno.copy(conn, conn);
}