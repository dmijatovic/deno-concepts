// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
/** Compose multiple middleware functions into a single middleware function. */
export function compose(middleware) {
    return function composedMiddleware(context, next) {
        let index = -1;
        function dispatch(i) {
            if (i <= index) {
                Promise.reject(new Error("next() called multiple times."));
            }
            index = i;
            let fn = middleware[i];
            if (i === middleware.length) {
                fn = next;
            }
            if (!fn) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return dispatch(0);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWlkZGxld2FyZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1pZGRsZXdhcmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEseUVBQXlFO0FBYXpFLCtFQUErRTtBQUMvRSxNQUFNLFVBQVUsT0FBTyxDQUlyQixVQUE4QjtJQUU5QixPQUFPLFNBQVMsa0JBQWtCLENBQUMsT0FBVSxFQUFFLElBQTBCO1FBQ3ZFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWYsU0FBUyxRQUFRLENBQUMsQ0FBUztZQUN6QixJQUFJLENBQUMsSUFBSSxLQUFLLEVBQUU7Z0JBQ2QsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDLENBQUM7YUFDNUQ7WUFDRCxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsSUFBSSxFQUFFLEdBQWlDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFJLENBQUMsS0FBSyxVQUFVLENBQUMsTUFBTSxFQUFFO2dCQUMzQixFQUFFLEdBQUcsSUFBSSxDQUFDO2FBQ1g7WUFDRCxJQUFJLENBQUMsRUFBRSxFQUFFO2dCQUNQLE9BQU8sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO2FBQzFCO1lBQ0QsSUFBSTtnQkFDRixPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pFO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzVCO1FBQ0gsQ0FBQztRQUVELE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztBQUNKLENBQUMifQ==