/**
 * Simple TLS server with DENO
 */
import { listenAndServe } from '../deps.ts';
import { Router } from './routes/index.ts';
// const certFile:string = config().CERT_FILE
// const keyFile:string = config().KEY_FILE
const certFile = Deno.env.get("CERT_FILE") || "./cert/server.crt";
const keyFile = Deno.env.get("KEY_FILE") || "./cert/server.pem";
console.log("certFile...", certFile);
console.log("keyFile...", keyFile);
const options = {
    hostname: "localhost:8080",
    port: 10443,
};
console.log("Starting DENO server on ", options.hostname);
listenAndServe(options.hostname, Router)
    .then(() => {
    console.log("Deno...returned from listenAndServe");
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztHQUVHO0FBRUgsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQTtBQUN6QyxPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sbUJBQW1CLENBQUE7QUFFeEMsNkNBQTZDO0FBQzdDLDJDQUEyQztBQUUzQyxNQUFNLFFBQVEsR0FBVSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsSUFBSSxtQkFBbUIsQ0FBQTtBQUN4RSxNQUFNLE9BQU8sR0FBVSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsSUFBSSxtQkFBbUIsQ0FBQTtBQUV0RSxPQUFPLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQTtBQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQTtBQUVsQyxNQUFNLE9BQU8sR0FBQztJQUNaLFFBQVEsRUFBQyxnQkFBZ0I7SUFDekIsSUFBSSxFQUFDLEtBQUs7Q0FHWCxDQUFBO0FBR0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7QUFFekQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDO0tBQ3ZDLElBQUksQ0FBQyxHQUFFLEVBQUU7SUFDUixPQUFPLENBQUMsR0FBRyxDQUFDLHFDQUFxQyxDQUFDLENBQUE7QUFDcEQsQ0FBQyxDQUFDLENBQUEifQ==