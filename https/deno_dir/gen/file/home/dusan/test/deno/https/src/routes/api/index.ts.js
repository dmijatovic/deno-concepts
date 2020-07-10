import ApiTest from './test.ts';
import Page404 from '../404.ts';
function ApiRootResponse() {
    return {
        status: 200,
        body: `This is /api root response!`
    };
}
function methodNotSupported() {
    return {
        status: 400,
        body: `Bad request: Method not supported`
    };
}
export default (req) => {
    switch (req.url.toLowerCase()) {
        case "/api":
        case "/api/":
            if (req.method.toUpperCase() === "GET") {
                return req.respond(ApiRootResponse());
            }
            else {
                return req.respond(methodNotSupported());
            }
        case "/api/test":
            return ApiTest(req);
        default:
            return Page404(req);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLE9BQU8sTUFBTSxXQUFXLENBQUE7QUFDL0IsT0FBTyxPQUFPLE1BQU0sV0FBVyxDQUFBO0FBRS9CLFNBQVMsZUFBZTtJQUN0QixPQUFNO1FBQ0osTUFBTSxFQUFDLEdBQUc7UUFDVixJQUFJLEVBQUMsNkJBQTZCO0tBQ25DLENBQUE7QUFDSCxDQUFDO0FBRUQsU0FBUyxrQkFBa0I7SUFDekIsT0FBTTtRQUNKLE1BQU0sRUFBQyxHQUFHO1FBQ1YsSUFBSSxFQUFDLG1DQUFtQztLQUN6QyxDQUFBO0FBQ0gsQ0FBQztBQUVELGVBQWUsQ0FBQyxHQUFpQixFQUFDLEVBQUU7SUFDbEMsUUFBTyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFDO1FBQzNCLEtBQUssTUFBTSxDQUFDO1FBQ1osS0FBSyxPQUFPO1lBQ1YsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLEtBQUssRUFBQztnQkFDckMsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUE7YUFDdEM7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQTthQUN6QztRQUNILEtBQUssV0FBVztZQUNkLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ3JCO1lBQ0UsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUE7S0FDdEI7QUFDSCxDQUFDLENBQUEifQ==