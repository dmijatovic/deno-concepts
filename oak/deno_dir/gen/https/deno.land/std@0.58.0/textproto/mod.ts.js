// Based on https://github.com/golang/go/tree/master/src/net/textproto
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
import { charCode } from "../io/util.ts";
import { concat } from "../bytes/mod.ts";
import { decode } from "../encoding/utf8.ts";
// FROM https://github.com/denoland/deno/blob/b34628a26ab0187a827aa4ebe256e23178e25d39/cli/js/web/headers.ts#L9
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
function str(buf) {
    if (buf == null) {
        return "";
    }
    else {
        return decode(buf);
    }
}
export class TextProtoReader {
    constructor(r) {
        this.r = r;
    }
    /** readLine() reads a single line from the TextProtoReader,
     * eliding the final \n or \r\n from the returned string.
     */
    async readLine() {
        const s = await this.readLineSlice();
        if (s === null)
            return null;
        return str(s);
    }
    /** ReadMIMEHeader reads a MIME-style header from r.
     * The header is a sequence of possibly continued Key: Value lines
     * ending in a blank line.
     * The returned map m maps CanonicalMIMEHeaderKey(key) to a
     * sequence of values in the same order encountered in the input.
     *
     * For example, consider this input:
     *
     *	My-Key: Value 1
     *	Long-Key: Even
     *	       Longer Value
     *	My-Key: Value 2
     *
     * Given that input, ReadMIMEHeader returns the map:
     *
     *	map[string][]string{
     *		"My-Key": {"Value 1", "Value 2"},
     *		"Long-Key": {"Even Longer Value"},
     *	}
     */
    async readMIMEHeader() {
        const m = new Headers();
        let line;
        // The first line cannot start with a leading space.
        let buf = await this.r.peek(1);
        if (buf === null) {
            return null;
        }
        else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
            line = (await this.readLineSlice());
        }
        buf = await this.r.peek(1);
        if (buf === null) {
            throw new Deno.errors.UnexpectedEof();
        }
        else if (buf[0] == charCode(" ") || buf[0] == charCode("\t")) {
            throw new Deno.errors.InvalidData(`malformed MIME header initial line: ${str(line)}`);
        }
        while (true) {
            const kv = await this.readLineSlice(); // readContinuedLineSlice
            if (kv === null)
                throw new Deno.errors.UnexpectedEof();
            if (kv.byteLength === 0)
                return m;
            // Key ends at first colon
            let i = kv.indexOf(charCode(":"));
            if (i < 0) {
                throw new Deno.errors.InvalidData(`malformed MIME header line: ${str(kv)}`);
            }
            //let key = canonicalMIMEHeaderKey(kv.subarray(0, endKey));
            const key = str(kv.subarray(0, i));
            // As per RFC 7230 field-name is a token,
            // tokens consist of one or more chars.
            // We could throw `Deno.errors.InvalidData` here,
            // but better to be liberal in what we
            // accept, so if we get an empty key, skip it.
            if (key == "") {
                continue;
            }
            // Skip initial spaces in value.
            i++; // skip colon
            while (i < kv.byteLength &&
                (kv[i] == charCode(" ") || kv[i] == charCode("\t"))) {
                i++;
            }
            const value = str(kv.subarray(i)).replace(invalidHeaderCharRegex, encodeURI);
            // In case of invalid header we swallow the error
            // example: "Audio Mode" => invalid due to space in the key
            try {
                m.append(key, value);
            }
            catch {
                // Pass
            }
        }
    }
    async readLineSlice() {
        // this.closeDot();
        let line;
        while (true) {
            const r = await this.r.readLine();
            if (r === null)
                return null;
            const { line: l, more } = r;
            // Avoid the copy if the first call produced a full line.
            if (!line && !more) {
                // TODO(ry):
                // This skipSpace() is definitely misplaced, but I don't know where it
                // comes from nor how to fix it.
                if (this.skipSpace(l) === 0) {
                    return new Uint8Array(0);
                }
                return l;
            }
            line = line ? concat(line, l) : l;
            if (!more) {
                break;
            }
        }
        return line;
    }
    skipSpace(l) {
        let n = 0;
        for (let i = 0; i < l.length; i++) {
            if (l[i] === charCode(" ") || l[i] === charCode("\t")) {
                continue;
            }
            n++;
        }
        return n;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibW9kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNFQUFzRTtBQUN0RSxzREFBc0Q7QUFDdEQscURBQXFEO0FBQ3JELGlEQUFpRDtBQUdqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFN0MsK0dBQStHO0FBQy9HLE1BQU0sc0JBQXNCLEdBQUcsMEJBQTBCLENBQUM7QUFFMUQsU0FBUyxHQUFHLENBQUMsR0FBa0M7SUFDN0MsSUFBSSxHQUFHLElBQUksSUFBSSxFQUFFO1FBQ2YsT0FBTyxFQUFFLENBQUM7S0FDWDtTQUFNO1FBQ0wsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDcEI7QUFDSCxDQUFDO0FBRUQsTUFBTSxPQUFPLGVBQWU7SUFDMUIsWUFBcUIsQ0FBWTtRQUFaLE1BQUMsR0FBRCxDQUFDLENBQVc7SUFBRyxDQUFDO0lBRXJDOztPQUVHO0lBQ0gsS0FBSyxDQUFDLFFBQVE7UUFDWixNQUFNLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxJQUFJLENBQUMsS0FBSyxJQUFJO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BbUJHO0lBQ0gsS0FBSyxDQUFDLGNBQWM7UUFDbEIsTUFBTSxDQUFDLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQTRCLENBQUM7UUFFakMsb0RBQW9EO1FBQ3BELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFD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