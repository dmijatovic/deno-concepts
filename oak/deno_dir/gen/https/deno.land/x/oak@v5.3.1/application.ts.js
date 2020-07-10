// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
import { Context } from "./context.ts";
import { serve as defaultServe, serveTLS as defaultServeTls, STATUS_TEXT, } from "./deps.ts";
import { KeyStack } from "./keyStack.ts";
import { compose } from "./middleware.ts";
function isOptionsTls(options) {
    return options.secure === true;
}
const ADDR_REGEXP = /^\[?([^\]]*)\]?:([0-9]{1,5})$/;
export class ApplicationErrorEvent extends ErrorEvent {
    constructor(eventInitDict) {
        super("error", eventInitDict);
        this.context = eventInitDict.context;
    }
}
export class ApplicationListenEvent extends Event {
    constructor(eventInitDict) {
        super("listen", eventInitDict);
        this.hostname = eventInitDict.hostname;
        this.port = eventInitDict.port;
        this.secure = eventInitDict.secure;
    }
}
/** A class which registers middleware (via `.use()`) and then processes
 * inbound requests against that middleware (via `.listen()`).
 *
 * The `context.state` can be typed via passing a generic argument when
 * constructing an instance of `Application`.
 */
export class Application extends EventTarget {
    constructor(options = {}) {
        super();
        this.#middleware = [];
        this.#getComposed = () => {
            if (!this.#composedMiddleware) {
                this.#composedMiddleware = compose(this.#middleware);
            }
            return this.#composedMiddleware;
        };
        /** Deal with uncaught errors in either the middleware or sending the
         * response. */
        this.#handleError = (context, error) => {
            if (!(error instanceof Error)) {
                error = new Error(`non-error thrown: ${JSON.stringify(error)}`);
            }
            const { message } = error;
            this.dispatchEvent(new ApplicationErrorEvent({ context, message, error }));
            if (!context.response.writable) {
                return;
            }
            for (const key of context.response.headers.keys()) {
                context.response.headers.delete(key);
            }
            if (error.headers && error.headers instanceof Headers) {
                for (const [key, value] of error.headers) {
                    context.response.headers.set(key, value);
                }
            }
            context.response.type = "text";
            const status = context.response.status =
                error instanceof Deno.errors.NotFound
                    ? 404
                    : error.status && typeof error.status === "number"
                        ? error.status
                        : 500;
            context.response.body = error.expose
                ? error.message
                : STATUS_TEXT.get(status);
        };
        /** Processing registered middleware on each request. */
        this.#handleRequest = async (request, secure, state) => {
            const context = new Context(this, request, secure);
            if (!state.closing && !state.closed) {
                state.handling = true;
                try {
                    await this.#getComposed()(context);
                }
                catch (err) {
                    this.#handleError(context, err);
                }
                finally {
                    state.handling = false;
                }
            }
            if (context.respond === false) {
                context.response.destroy();
                return;
            }
            try {
                await request.respond(await context.response.toServerResponse());
                context.response.destroy();
                if (state.closing) {
                    state.server.close();
                    state.closed = true;
                }
            }
            catch (err) {
                this.#handleError(context, err);
            }
        };
        const { state, keys, proxy, serve = defaultServe, serveTls = defaultServeTls, } = options;
        this.proxy = proxy ?? false;
        this.keys = keys;
        this.state = state ?? {};
        this.#serve = serve;
        this.#serveTls = serveTls;
    }
    #composedMiddleware;
    #keys;
    #middleware;
    #serve;
    #serveTls;
    /** A set of keys, or an instance of `KeyStack` which will be used to sign
     * cookies read and set by the application to avoid tampering with the
     * cookies. */
    get keys() {
        return this.#keys;
    }
    set keys(keys) {
        if (!keys) {
            this.#keys = undefined;
            return;
        }
        else if (Array.isArray(keys)) {
            this.#keys = new KeyStack(keys);
        }
        else {
            this.#keys = keys;
        }
    }
    #getComposed;
    /** Deal with uncaught errors in either the middleware or sending the
     * response. */
    #handleError;
    /** Processing registered middleware on each request. */
    #handleRequest;
    /** Add an event listener for an event.  Currently valid event types are
     * `"error"` and `"listen"`. */
    addEventListener(type, listener, options) {
        super.addEventListener(type, listener, options);
    }
    /** Handle an individual server request, returning the server response.  This
     * is similar to `.listen()`, but opening the connection and retrieving
     * requests are not the responsibility of the application.  If the generated
     * context gets set to not to respond, then the method resolves with
     * `undefined`, otherwise it resolves with a request that is compatible with
     * `std/http/server`. */
    async handle(request, secure = false) {
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        const context = new Context(this, request, secure);
        try {
            await this.#getComposed()(context);
        }
        catch (err) {
            this.#handleError(context, err);
        }
        if (context.respond === false) {
            context.response.destroy();
            return;
        }
        try {
            const response = await context.response.toServerResponse();
            context.response.destroy();
            return response;
        }
        catch (err) {
            this.#handleError(context, err);
            throw err;
        }
    }
    async listen(options) {
        if (!this.#middleware.length) {
            throw new TypeError("There is no middleware to process requests.");
        }
        if (typeof options === "string") {
            const match = ADDR_REGEXP.exec(options);
            if (!match) {
                throw TypeError(`Invalid address passed: "${options}"`);
            }
            const [, hostname, portStr] = match;
            options = { hostname, port: parseInt(portStr, 10) };
        }
        const server = isOptionsTls(options)
            ? this.#serveTls(options)
            : this.#serve(options);
        const { signal } = options;
        const state = {
            closed: false,
            closing: false,
            handling: false,
            server,
        };
        if (signal) {
            signal.addEventListener("abort", () => {
                if (!state.handling) {
                    server.close();
                    state.closed = true;
                }
                state.closing = true;
            });
        }
        const { hostname, port, secure = false } = options;
        this.dispatchEvent(new ApplicationListenEvent({ hostname, port, secure }));
        try {
            for await (const request of server) {
                this.#handleRequest(request, secure, state);
            }
        }
        catch (error) {
            const message = error instanceof Error
                ? error.message
                : "Application Error";
            this.dispatchEvent(new ApplicationErrorEvent({ message, error }));
        }
    }
    /** Register middleware to be used with the application.  Middleware will
     * be processed in the order it is added, but middleware can control the flow
     * of execution via the use of the `next()` function that the middleware
     * function will be called with.  The `context` object provides information
     * about the current state of the application.
     *
     * Basic usage:
     *
     * ```ts
     * const import { Application } from "https://deno.land/x/oak/mod.ts";
     *
     * const app = new Application();
     *
     * app.use((ctx, next) => {
     *   ctx.request; // contains request information
     *   ctx.response; // setups up information to use in the response;
     *   await next(); // manages the flow control of the middleware execution
     * });
     *
     * await app.listen({ port: 80 });
     * ```
     */
    use(...middleware) {
        this.#middleware.push(...middleware);
        this.#composedMiddleware = undefined;
        return this;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhcHBsaWNhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5RUFBeUU7QUFFekUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUN2QyxPQUFPLEVBQ0wsS0FBSyxJQUFJLFlBQVksRUFDckIsUUFBUSxJQUFJLGVBQWUsRUFFM0IsV0FBVyxHQUNaLE1BQU0sV0FBVyxDQUFDO0FBQ25CLE9BQU8sRUFBTyxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUMsT0FBTyxFQUFFLE9BQU8sRUFBYyxNQUFNLGlCQUFpQixDQUFDO0FBMkJ0RCxTQUFTLFlBQVksQ0FBQyxPQUFzQjtJQUMxQyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDO0FBQ2pDLENBQUM7QUErREQsTUFBTSxXQUFXLEdBQUcsK0JBQStCLENBQUM7QUFFcEQsTUFBTSxPQUFPLHFCQUF1QyxTQUFRLFVBQVU7SUFHcEUsWUFBWSxhQUEyQztRQUNyRCxLQUFLLENBQUMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztJQUN2QyxDQUFDO0NBQ0Y7QUFFRCxNQUFNLE9BQU8sc0JBQXVCLFNBQVEsS0FBSztJQUsvQyxZQUFZLGFBQXlDO1FBQ25ELEtBQUssQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7SUFDckMsQ0FBQztDQUNGO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sV0FDWCxTQUFRLFdBQVc7SUF5Q25CLFlBQVksVUFBa0MsRUFB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