import Home from './home.ts';
import Api from './api/index.ts';
import Page404 from './404.ts';
export function Router(req) {
    switch (true) {
        case req.url.toLowerCase() === "/":
            return Home(req);
        case req.url.toLowerCase().includes("/api"):
            return Api(req);
        default:
            return Page404(req);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLElBQUksTUFBTSxXQUFXLENBQUE7QUFDNUIsT0FBTyxHQUFHLE1BQU0sZ0JBQWdCLENBQUE7QUFDaEMsT0FBTyxPQUFPLE1BQU0sVUFBVSxDQUFBO0FBRTlCLE1BQU0sVUFBVSxNQUFNLENBQUMsR0FBaUI7SUFDdEMsUUFBTyxJQUFJLEVBQUM7UUFDVixLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEtBQUcsR0FBRztZQUM5QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNsQixLQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQztZQUN6QyxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNqQjtZQUNFLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3RCO0FBQ0gsQ0FBQyJ9