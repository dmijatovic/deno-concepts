// Copyright 2018-2020 the oak authors. All rights reserved. MIT license.
import { contentType, Status } from "./deps.ts";
import { isHtml, isRedirectStatus, encodeUrl } from "./util.ts";
/** A symbol that indicates to `response.redirect()` to attempt to redirect
 * back to the request referrer.  For example:
 *
 * ```ts
 * import { Application, REDIRECT_BACK } from "https://deno.land/x/oak/mod.ts";
 *
 * const app = new Application();
 *
 * app.use((ctx) => {
 *   if (ctx.request.url.pathName === "/back") {
 *     ctx.response.redirect(REDIRECT_BACK, "/");
 *   }
 * });
 *
 * await app.listen({ port: 80 });
 * ```
 */
export const REDIRECT_BACK = Symbol("redirect backwards");
const BODY_TYPES = ["string", "number", "bigint", "boolean", "symbol"];
const encoder = new TextEncoder();
/** Guard for `Deno.Reader`. */
function isReader(value) {
    return value && typeof value === "object" && "read" in value &&
        typeof value.read === "function";
}
function isPromiseLike(value) {
    return value && typeof value === "object" && "then" in value &&
        typeof value.then === "function";
}
async function convertBody(body, type) {
    let result;
    if (BODY_TYPES.includes(typeof body)) {
        const bodyText = String(body);
        result = encoder.encode(bodyText);
        type = type ?? (isHtml(bodyText) ? "html" : "text/plain");
    }
    else if (body instanceof Uint8Array || isReader(body)) {
        result = body;
    }
    else if (body && typeof body === "object") {
        result = encoder.encode(JSON.stringify(body));
        type = type ?? "json";
    }
    else if (typeof body === "function") {
        const result = body.call(null);
        return convertBody(isPromiseLike(result) ? await result : result, type);
    }
    else if (body) {
        throw new TypeError("Response body was set but could not convert.");
    }
    return [result, type];
}
/** An interface to control what response will be sent when the middleware
 * finishes processing the request. */
export class Response {
    constructor(request) {
        this.#headers = new Headers();
        this.#resources = [];
        this.#writable = true;
        this.#getBody = async () => {
            const [body, type] = await convertBody(this.body, this.type);
            this.type = type;
            return body;
        };
        this.#setContentType = () => {
            if (this.type) {
                const contentTypeString = contentType(this.type);
                if (contentTypeString && !this.headers.has("Content-Type")) {
                    this.headers.append("Content-Type", contentTypeString);
                }
            }
        };
        this.#request = request;
    }
    #body;
    #headers;
    #request;
    #resources;
    #serverResponse;
    #status;
    #type;
    #writable;
    #getBody;
    #setContentType;
    /** The body of the response.  The body will be automatically processed when
     * the response is being sent and converted to a `Uint8Array` or a
     * `Deno.Reader`. */
    get body() {
        return this.#body;
    }
    /** The body of the response.  The body will be automatically processed when
     * the response is being sent and converted to a `Uint8Array` or a
     * `Deno.Reader`. */
    set body(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#body = value;
    }
    /** Headers that will be returned in the response. */
    get headers() {
        return this.#headers;
    }
    /** Headers that will be returned in the response. */
    set headers(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#headers = value;
    }
    /** The HTTP status of the response.  If this has not been explicitly set,
     * reading the value will return what would be the value of status if the
     * response were sent at this point in processing the middleware.  If the body
     * has been set, the status will be `200 OK`.  If a value for the body has
     * not been set yet, the status will be `404 Not Found`. */
    get status() {
        if (this.#status) {
            return this.#status;
        }
        const typeofbody = typeof this.body;
        return this.body &&
            (BODY_TYPES.includes(typeofbody) || typeofbody === "object")
            ? Status.OK
            : Status.NotFound;
    }
    /** The HTTP status of the response.  If this has not been explicitly set,
     * reading the value will return what would be the value of status if the
     * response were sent at this point in processing the middleware.  If the body
     * has been set, the status will be `200 OK`.  If a value for the body has
     * not been set yet, the status will be `404 Not Found`. */
    set status(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#status = value;
    }
    /** The media type, or extension of the response.  Setting this value will
     * ensure an appropriate `Content-Type` header is added to the response. */
    get type() {
        return this.#type;
    }
    /** The media type, or extension of the response.  Setting this value will
     * ensure an appropriate `Content-Type` header is added to the response. */
    set type(value) {
        if (!this.#writable) {
            throw new Error("The response is not writable.");
        }
        this.#type = value;
    }
    /** A read-only property which determines if the response is writable or not.
     * Once the response has been processed, this value is set to `false`. */
    get writable() {
        return this.#writable;
    }
    /** Add a resource to the list of resources that will be closed when the
     * request is destroyed. */
    addResource(rid) {
        this.#resources.push(rid);
    }
    /** Release any resources that are being tracked by the response. */
    destroy() {
        this.#writable = false;
        this.#body = undefined;
        this.#serverResponse = undefined;
        for (const rid of this.#resources) {
            Deno.close(rid);
        }
    }
    redirect(url, alt = "/") {
        if (url === REDIRECT_BACK) {
            url = this.#request.headers.get("Referrer") ?? String(alt);
        }
        else if (typeof url === "object") {
            url = String(url);
        }
        this.headers.set("Location", encodeUrl(url));
        if (!this.status || !isRedirectStatus(this.status)) {
            this.status = Status.Found;
        }
        if (this.#request.accepts("html")) {
            url = encodeURI(url);
            this.type = "text/html; charset=utf-8";
            this.body = `Redirecting to <a href="${url}">${url}</a>.`;
            return;
        }
        this.type = "text/plain; charset=utf-8";
        this.body = `Redirecting to ${url}.`;
    }
    /** Take this response and convert it to the response used by the Deno net
     * server.  Calling this will set the response to not be writable.
     *
     * Most users will have no need to call this method. */
    async toServerResponse() {
        if (this.#serverResponse) {
            return this.#serverResponse;
        }
        // Process the body
        const body = await this.#getBody();
        // If there is a response type, set the content type header
        this.#setContentType();
        const { headers } = this;
        // If there is no body and no content type and no set length, then set the
        // content length to 0
        if (!(body ||
            headers.has("Content-Type") ||
            headers.has("Content-Length"))) {
            headers.append("Content-Length", "0");
        }
        this.#writable = false;
        return this.#serverResponse = {
            status: this.#status ?? (body ? Status.OK : Status.NotFound),
            body,
            headers,
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJyZXNwb25zZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5RUFBeUU7QUFFekUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHaEQsT0FBTyxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFhaEU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFFMUQsTUFBTSxVQUFVLEdBQUcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkUsTUFBTSxPQUFPLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUVsQywrQkFBK0I7QUFDL0IsU0FBUyxRQUFRLENBQUMsS0FBVTtJQUMxQixPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUs7UUFDMUQsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztBQUNyQyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsS0FBVTtJQUMvQixPQUFPLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLElBQUksTUFBTSxJQUFJLEtBQUs7UUFDMUQsT0FBTyxLQUFLLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztBQUNyQyxDQUFDO0FBRUQsS0FBSyxVQUFVLFdBQVcsQ0FDeEIsSUFBeUIsRUFDekIsSUFBYTtJQUViLElBQUksTUFBNEMsQ0FBQztJQUNqRCxJQUFJLFVBQVUsQ0FBQyxRQUFRLENBQUMsT0FBTyxJQUFJLENBQUMsRUFBRTtRQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDOUIsTUFBTSxHQUFHLE9B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