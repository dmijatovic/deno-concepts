// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

"use strict";

// @ts-nocheck
/* eslint-disable */
let System, __instantiate;
(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };
  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }
  __instantiate = (m, a) => {
    System = __instantiate = undefined;
    rF(m);
    return a ? gExpA(m) : gExp(m);
  };
})();

System.register("https://deno.land/std@0.60.0/encoding/utf8", [], function (exports_1, context_1) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_1 && context_1.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
        return encoder.encode(input);
    }
    exports_1("encode", encode);
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
        return decoder.decode(input);
    }
    exports_1("decode", decode);
    return {
        setters: [],
        execute: function () {
            /** A default TextEncoder instance */
            exports_1("encoder", encoder = new TextEncoder());
            /** A default TextDecoder instance */
            exports_1("decoder", decoder = new TextDecoder());
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std@0.60.0/bytes/mod", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    /** Find first index of binary pattern from a. If not found, then return -1
     * @param source source array
     * @param pat pattern to find in source array
     */
    function findIndex(source, pat) {
        const s = pat[0];
        for (let i = 0; i < source.length; i++) {
            if (source[i] !== s)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j++;
                if (source[j] !== pat[j - pin]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin;
            }
        }
        return -1;
    }
    exports_2("findIndex", findIndex);
    /** Find last index of binary pattern from a. If not found, then return -1.
     * @param source source array
     * @param pat pattern to find in source array
     */
    function findLastIndex(source, pat) {
        const e = pat[pat.length - 1];
        for (let i = source.length - 1; i >= 0; i--) {
            if (source[i] !== e)
                continue;
            const pin = i;
            let matched = 1;
            let j = i;
            while (matched < pat.length) {
                j--;
                if (source[j] !== pat[pat.length - 1 - (pin - j)]) {
                    break;
                }
                matched++;
            }
            if (matched === pat.length) {
                return pin - pat.length + 1;
            }
        }
        return -1;
    }
    exports_2("findLastIndex", findLastIndex);
    /** Check whether binary arrays are equal to each other.
     * @param source first array to check equality
     * @param match second array to check equality
     */
    function equal(source, match) {
        if (source.length !== match.length)
            return false;
        for (let i = 0; i < match.length; i++) {
            if (source[i] !== match[i])
                return false;
        }
        return true;
    }
    exports_2("equal", equal);
    /** Check whether binary array starts with prefix.
     * @param source srouce array
     * @param prefix prefix array to check in source
     */
    function hasPrefix(source, prefix) {
        for (let i = 0, max = prefix.length; i < max; i++) {
            if (source[i] !== prefix[i])
                return false;
        }
        return true;
    }
    exports_2("hasPrefix", hasPrefix);
    /** Check whether binary array ends with suffix.
     * @param source source array
     * @param suffix suffix array to check in source
     */
    function hasSuffix(source, suffix) {
        for (let srci = source.length - 1, sfxi = suffix.length - 1; sfxi >= 0; srci--, sfxi--) {
            if (source[srci] !== suffix[sfxi])
                return false;
        }
        return true;
    }
    exports_2("hasSuffix", hasSuffix);
    /** Repeat bytes. returns a new byte slice consisting of `count` copies of `b`.
     * @param origin The origin bytes
     * @param count The count you want to repeat.
     */
    function repeat(origin, count) {
        if (count === 0) {
            return new Uint8Array();
        }
        if (count < 0) {
            throw new Error("bytes: negative repeat count");
        }
        else if ((origin.length * count) / count !== origin.length) {
            throw new Error("bytes: repeat count causes overflow");
        }
        const int = Math.floor(count);
        if (int !== count) {
            throw new Error("bytes: repeat count must be an integer");
        }
        const nb = new Uint8Array(origin.length * count);
        let bp = copyBytes(origin, nb);
        for (; bp < nb.length; bp *= 2) {
            copyBytes(nb.slice(0, bp), nb, bp);
        }
        return nb;
    }
    exports_2("repeat", repeat);
    /** Concatenate two binary arrays and return new one.
     * @param origin origin array to concatenate
     * @param b array to concatenate with origin
     */
    function concat(origin, b) {
        const output = new Uint8Array(origin.length + b.length);
        output.set(origin, 0);
        output.set(b, origin.length);
        return output;
    }
    exports_2("concat", concat);
    /** Check source array contains pattern array.
     * @param source source array
     * @param pat patter array
     */
    function contains(source, pat) {
        return findIndex(source, pat) != -1;
    }
    exports_2("contains", contains);
    /**
     * Copy bytes from one Uint8Array to another.  Bytes from `src` which don't fit
     * into `dst` will not be copied.
     *
     * @param src Source byte array
     * @param dst Destination byte array
     * @param off Offset into `dst` at which to begin writing values from `src`.
     * @return number of bytes copied
     */
    function copyBytes(src, dst, off = 0) {
        off = Math.max(0, Math.min(off, dst.byteLength));
        const dstBytesAvailable = dst.byteLength - off;
        if (src.byteLength > dstBytesAvailable) {
            src = src.subarray(0, dstBytesAvailable);
        }
        dst.set(src, off);
        return src.byteLength;
    }
    exports_2("copyBytes", copyBytes);
    return {
        setters: [],
        execute: function () {
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std@0.60.0/_util/assert", [], function (exports_3, context_3) {
    "use strict";
    var DenoStdInternalError;
    var __moduleName = context_3 && context_3.id;
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
        if (!expr) {
            throw new DenoStdInternalError(msg);
        }
    }
    exports_3("assert", assert);
    return {
        setters: [],
        execute: function () {
            DenoStdInternalError = class DenoStdInternalError extends Error {
                constructor(message) {
                    super(message);
                    this.name = "DenoStdInternalError";
                }
            };
            exports_3("DenoStdInternalError", DenoStdInternalError);
        }
    };
});
// Based on https://github.com/golang/go/blob/891682/src/bufio/bufio.go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register("https://deno.land/std@0.60.0/io/bufio", ["https://deno.land/std@0.60.0/bytes/mod", "https://deno.land/std@0.60.0/_util/assert"], function (exports_4, context_4) {
    "use strict";
    var mod_ts_1, assert_ts_1, DEFAULT_BUF_SIZE, MIN_BUF_SIZE, MAX_CONSECUTIVE_EMPTY_READS, CR, LF, BufferFullError, PartialReadError, BufReader, AbstractBufBase, BufWriter, BufWriterSync;
    var __moduleName = context_4 && context_4.id;
    /** Generate longest proper prefix which is also suffix array. */
    function createLPS(pat) {
        const lps = new Uint8Array(pat.length);
        lps[0] = 0;
        let prefixEnd = 0;
        let i = 1;
        while (i < lps.length) {
            if (pat[i] == pat[prefixEnd]) {
                prefixEnd++;
                lps[i] = prefixEnd;
                i++;
            }
            else if (prefixEnd === 0) {
                lps[i] = 0;
                i++;
            }
            else {
                prefixEnd = pat[prefixEnd - 1];
            }
        }
        return lps;
    }
    /** Read delimited bytes from a Reader. */
    async function* readDelim(reader, delim) {
        // Avoid unicode problems
        const delimLen = delim.length;
        const delimLPS = createLPS(delim);
        let inputBuffer = new Deno.Buffer();
        const inspectArr = new Uint8Array(Math.max(1024, delimLen + 1));
        // Modified KMP
        let inspectIndex = 0;
        let matchIndex = 0;
        while (true) {
            const result = await reader.read(inspectArr);
            if (result === null) {
                // Yield last chunk.
                yield inputBuffer.bytes();
                return;
            }
            if (result < 0) {
                // Discard all remaining and silently fail.
                return;
            }
            const sliceRead = inspectArr.subarray(0, result);
            await Deno.writeAll(inputBuffer, sliceRead);
            let sliceToProcess = inputBuffer.bytes();
            while (inspectIndex < sliceToProcess.length) {
                if (sliceToProcess[inspectIndex] === delim[matchIndex]) {
                    inspectIndex++;
                    matchIndex++;
                    if (matchIndex === delimLen) {
                        // Full match
                        const matchEnd = inspectIndex - delimLen;
                        const readyBytes = sliceToProcess.subarray(0, matchEnd);
                        // Copy
                        const pendingBytes = sliceToProcess.slice(inspectIndex);
                        yield readyBytes;
                        // Reset match, different from KMP.
                        sliceToProcess = pendingBytes;
                        inspectIndex = 0;
                        matchIndex = 0;
                    }
                }
                else {
                    if (matchIndex === 0) {
                        inspectIndex++;
                    }
                    else {
                        matchIndex = delimLPS[matchIndex - 1];
                    }
                }
            }
            // Keep inspectIndex and matchIndex.
            inputBuffer = new Deno.Buffer(sliceToProcess);
        }
    }
    exports_4("readDelim", readDelim);
    /** Read delimited strings from a Reader. */
    async function* readStringDelim(reader, delim) {
        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        for await (const chunk of readDelim(reader, encoder.encode(delim))) {
            yield decoder.decode(chunk);
        }
    }
    exports_4("readStringDelim", readStringDelim);
    /** Read strings line-by-line from a Reader. */
    // eslint-disable-next-line require-await
    async function* readLines(reader) {
        yield* readStringDelim(reader, "\n");
    }
    exports_4("readLines", readLines);
    return {
        setters: [
            function (mod_ts_1_1) {
                mod_ts_1 = mod_ts_1_1;
            },
            function (assert_ts_1_1) {
                assert_ts_1 = assert_ts_1_1;
            }
        ],
        execute: function () {
            DEFAULT_BUF_SIZE = 4096;
            MIN_BUF_SIZE = 16;
            MAX_CONSECUTIVE_EMPTY_READS = 100;
            CR = "\r".charCodeAt(0);
            LF = "\n".charCodeAt(0);
            BufferFullError = class BufferFullError extends Error {
                constructor(partial) {
                    super("Buffer full");
                    this.partial = partial;
                    this.name = "BufferFullError";
                }
            };
            exports_4("BufferFullError", BufferFullError);
            PartialReadError = class PartialReadError extends Deno.errors.UnexpectedEof {
                constructor() {
                    super("Encountered UnexpectedEof, data only partially read");
                    this.name = "PartialReadError";
                }
            };
            exports_4("PartialReadError", PartialReadError);
            /** BufReader implements buffering for a Reader object. */
            BufReader = class BufReader {
                constructor(rd, size = DEFAULT_BUF_SIZE) {
                    this.r = 0; // buf read position.
                    this.w = 0; // buf write position.
                    this.eof = false;
                    if (size < MIN_BUF_SIZE) {
                        size = MIN_BUF_SIZE;
                    }
                    this._reset(new Uint8Array(size), rd);
                }
                // private lastByte: number;
                // private lastCharSize: number;
                /** return new BufReader unless r is BufReader */
                static create(r, size = DEFAULT_BUF_SIZE) {
                    return r instanceof BufReader ? r : new BufReader(r, size);
                }
                /** Returns the size of the underlying buffer in bytes. */
                size() {
                    return this.buf.byteLength;
                }
                buffered() {
                    return this.w - this.r;
                }
                // Reads a new chunk into the buffer.
                async _fill() {
                    // Slide existing data to beginning.
                    if (this.r > 0) {
                        this.buf.copyWithin(0, this.r, this.w);
                        this.w -= this.r;
                        this.r = 0;
                    }
                    if (this.w >= this.buf.byteLength) {
                        throw Error("bufio: tried to fill full buffer");
                    }
                    // Read new data: try a limited number of times.
                    for (let i = MAX_CONSECUTIVE_EMPTY_READS; i > 0; i--) {
                        const rr = await this.rd.read(this.buf.subarray(this.w));
                        if (rr === null) {
                            this.eof = true;
                            return;
                        }
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                        if (rr > 0) {
                            return;
                        }
                    }
                    throw new Error(`No progress after ${MAX_CONSECUTIVE_EMPTY_READS} read() calls`);
                }
                /** Discards any buffered data, resets all state, and switches
                 * the buffered reader to read from r.
                 */
                reset(r) {
                    this._reset(this.buf, r);
                }
                _reset(buf, rd) {
                    this.buf = buf;
                    this.rd = rd;
                    this.eof = false;
                    // this.lastByte = -1;
                    // this.lastCharSize = -1;
                }
                /** reads data into p.
                 * It returns the number of bytes read into p.
                 * The bytes are taken from at most one Read on the underlying Reader,
                 * hence n may be less than len(p).
                 * To read exactly len(p) bytes, use io.ReadFull(b, p).
                 */
                async read(p) {
                    let rr = p.byteLength;
                    if (p.byteLength === 0)
                        return rr;
                    if (this.r === this.w) {
                        if (p.byteLength >= this.buf.byteLength) {
                            // Large read, empty buffer.
                            // Read directly into p to avoid copy.
                            const rr = await this.rd.read(p);
                            const nread = rr ?? 0;
                            assert_ts_1.assert(nread >= 0, "negative read");
                            // if (rr.nread > 0) {
                            //   this.lastByte = p[rr.nread - 1];
                            //   this.lastCharSize = -1;
                            // }
                            return rr;
                        }
                        // One read.
                        // Do not use this.fill, which will loop.
                        this.r = 0;
                        this.w = 0;
                        rr = await this.rd.read(this.buf);
                        if (rr === 0 || rr === null)
                            return rr;
                        assert_ts_1.assert(rr >= 0, "negative read");
                        this.w += rr;
                    }
                    // copy as much as we can
                    const copied = mod_ts_1.copyBytes(this.buf.subarray(this.r, this.w), p, 0);
                    this.r += copied;
                    // this.lastByte = this.buf[this.r - 1];
                    // this.lastCharSize = -1;
                    return copied;
                }
                /** reads exactly `p.length` bytes into `p`.
                 *
                 * If successful, `p` is returned.
                 *
                 * If the end of the underlying stream has been reached, and there are no more
                 * bytes available in the buffer, `readFull()` returns `null` instead.
                 *
                 * An error is thrown if some bytes could be read, but not enough to fill `p`
                 * entirely before the underlying stream reported an error or EOF. Any error
                 * thrown will have a `partial` property that indicates the slice of the
                 * buffer that has been successfully filled with data.
                 *
                 * Ported from https://golang.org/pkg/io/#ReadFull
                 */
                async readFull(p) {
                    let bytesRead = 0;
                    while (bytesRead < p.length) {
                        try {
                            const rr = await this.read(p.subarray(bytesRead));
                            if (rr === null) {
                                if (bytesRead === 0) {
                                    return null;
                                }
                                else {
                                    throw new PartialReadError();
                                }
                            }
                            bytesRead += rr;
                        }
                        catch (err) {
                            err.partial = p.subarray(0, bytesRead);
                            throw err;
                        }
                    }
                    return p;
                }
                /** Returns the next byte [0, 255] or `null`. */
                async readByte() {
                    while (this.r === this.w) {
                        if (this.eof)
                            return null;
                        await this._fill(); // buffer is empty.
                    }
                    const c = this.buf[this.r];
                    this.r++;
                    // this.lastByte = c;
                    return c;
                }
                /** readString() reads until the first occurrence of delim in the input,
                 * returning a string containing the data up to and including the delimiter.
                 * If ReadString encounters an error before finding a delimiter,
                 * it returns the data read before the error and the error itself
                 * (often `null`).
                 * ReadString returns err != nil if and only if the returned data does not end
                 * in delim.
                 * For simple uses, a Scanner may be more convenient.
                 */
                async readString(delim) {
                    if (delim.length !== 1) {
                        throw new Error("Delimiter should be a single character");
                    }
                    const buffer = await this.readSlice(delim.charCodeAt(0));
                    if (buffer === null)
                        return null;
                    return new TextDecoder().decode(buffer);
                }
                /** `readLine()` is a low-level line-reading primitive. Most callers should
                 * use `readString('\n')` instead or use a Scanner.
                 *
                 * `readLine()` tries to return a single line, not including the end-of-line
                 * bytes. If the line was too long for the buffer then `more` is set and the
                 * beginning of the line is returned. The rest of the line will be returned
                 * from future calls. `more` will be false when returning the last fragment
                 * of the line. The returned buffer is only valid until the next call to
                 * `readLine()`.
                 *
                 * The text returned from ReadLine does not include the line end ("\r\n" or
                 * "\n").
                 *
                 * When the end of the underlying stream is reached, the final bytes in the
                 * stream are returned. No indication or error is given if the input ends
                 * without a final line end. When there are no more trailing bytes to read,
                 * `readLine()` returns `null`.
                 *
                 * Calling `unreadByte()` after `readLine()` will always unread the last byte
                 * read (possibly a character belonging to the line end) even if that byte is
                 * not part of the line returned by `readLine()`.
                 */
                async readLine() {
                    let line;
                    try {
                        line = await this.readSlice(LF);
                    }
                    catch (err) {
                        let { partial } = err;
                        assert_ts_1.assert(partial instanceof Uint8Array, "bufio: caught error from `readSlice()` without `partial` property");
                        // Don't throw if `readSlice()` failed with `BufferFullError`, instead we
                        // just return whatever is available and set the `more` flag.
                        if (!(err instanceof BufferFullError)) {
                            throw err;
                        }
                        // Handle the case where "\r\n" straddles the buffer.
                        if (!this.eof &&
                            partial.byteLength > 0 &&
                            partial[partial.byteLength - 1] === CR) {
                            // Put the '\r' back on buf and drop it from line.
                            // Let the next call to ReadLine check for "\r\n".
                            assert_ts_1.assert(this.r > 0, "bufio: tried to rewind past start of buffer");
                            this.r--;
                            partial = partial.subarray(0, partial.byteLength - 1);
                        }
                        return { line: partial, more: !this.eof };
                    }
                    if (line === null) {
                        return null;
                    }
                    if (line.byteLength === 0) {
                        return { line, more: false };
                    }
                    if (line[line.byteLength - 1] == LF) {
                        let drop = 1;
                        if (line.byteLength > 1 && line[line.byteLength - 2] === CR) {
                            drop = 2;
                        }
                        line = line.subarray(0, line.byteLength - drop);
                    }
                    return { line, more: false };
                }
                /** `readSlice()` reads until the first occurrence of `delim` in the input,
                 * returning a slice pointing at the bytes in the buffer. The bytes stop
                 * being valid at the next read.
                 *
                 * If `readSlice()` encounters an error before finding a delimiter, or the
                 * buffer fills without finding a delimiter, it throws an error with a
                 * `partial` property that contains the entire buffer.
                 *
                 * If `readSlice()` encounters the end of the underlying stream and there are
                 * any bytes left in the buffer, the rest of the buffer is returned. In other
                 * words, EOF is always treated as a delimiter. Once the buffer is empty,
                 * it returns `null`.
                 *
                 * Because the data returned from `readSlice()` will be overwritten by the
                 * next I/O operation, most clients should use `readString()` instead.
                 */
                async readSlice(delim) {
                    let s = 0; // search start index
                    let slice;
                    while (true) {
                        // Search buffer.
                        let i = this.buf.subarray(this.r + s, this.w).indexOf(delim);
                        if (i >= 0) {
                            i += s;
                            slice = this.buf.subarray(this.r, this.r + i + 1);
                            this.r += i + 1;
                            break;
                        }
                        // EOF?
                        if (this.eof) {
                            if (this.r === this.w) {
                                return null;
                            }
                            slice = this.buf.subarray(this.r, this.w);
                            this.r = this.w;
                            break;
                        }
                        // Buffer full?
                        if (this.buffered() >= this.buf.byteLength) {
                            this.r = this.w;
                            // #4521 The internal buffer should not be reused across reads because it causes corruption of data.
                            const oldbuf = this.buf;
                            const newbuf = this.buf.slice(0);
                            this.buf = newbuf;
                            throw new BufferFullError(oldbuf);
                        }
                        s = this.w - this.r; // do not rescan area we scanned before
                        // Buffer is not full.
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = slice;
                            throw err;
                        }
                    }
                    // Handle last byte, if any.
                    // const i = slice.byteLength - 1;
                    // if (i >= 0) {
                    //   this.lastByte = slice[i];
                    //   this.lastCharSize = -1
                    // }
                    return slice;
                }
                /** `peek()` returns the next `n` bytes without advancing the reader. The
                 * bytes stop being valid at the next read call.
                 *
                 * When the end of the underlying stream is reached, but there are unread
                 * bytes left in the buffer, those bytes are returned. If there are no bytes
                 * left in the buffer, it returns `null`.
                 *
                 * If an error is encountered before `n` bytes are available, `peek()` throws
                 * an error with the `partial` property set to a slice of the buffer that
                 * contains the bytes that were available before the error occurred.
                 */
                async peek(n) {
                    if (n < 0) {
                        throw Error("negative count");
                    }
                    let avail = this.w - this.r;
                    while (avail < n && avail < this.buf.byteLength && !this.eof) {
                        try {
                            await this._fill();
                        }
                        catch (err) {
                            err.partial = this.buf.subarray(this.r, this.w);
                            throw err;
                        }
                        avail = this.w - this.r;
                    }
                    if (avail === 0 && this.eof) {
                        return null;
                    }
                    else if (avail < n && this.eof) {
                        return this.buf.subarray(this.r, this.r + avail);
                    }
                    else if (avail < n) {
                        throw new BufferFullError(this.buf.subarray(this.r, this.w));
                    }
                    return this.buf.subarray(this.r, this.r + n);
                }
            };
            exports_4("BufReader", BufReader);
            AbstractBufBase = class AbstractBufBase {
                constructor() {
                    this.usedBufferBytes = 0;
                    this.err = null;
                }
                /** Size returns the size of the underlying buffer in bytes. */
                size() {
                    return this.buf.byteLength;
                }
                /** Returns how many bytes are unused in the buffer. */
                available() {
                    return this.buf.byteLength - this.usedBufferBytes;
                }
                /** buffered returns the number of bytes that have been written into the
                 * current buffer.
                 */
                buffered() {
                    return this.usedBufferBytes;
                }
            };
            /** BufWriter implements buffering for an deno.Writer object.
             * If an error occurs writing to a Writer, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.Writer.
             */
            BufWriter = class BufWriter extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                /** return new BufWriter unless writer is BufWriter */
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriter ? writer : new BufWriter(writer, size);
                }
                /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                /** Flush writes any buffered data to the underlying io.Writer. */
                async flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        await Deno.writeAll(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
                async write(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            // Large write, empty buffer.
                            // Write directly from data to avoid copy.
                            try {
                                numBytesWritten = await this.writer.write(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            await this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_4("BufWriter", BufWriter);
            /** BufWriterSync implements buffering for a deno.WriterSync object.
             * If an error occurs writing to a WriterSync, no more data will be
             * accepted and all subsequent writes, and flush(), will return the error.
             * After all data has been written, the client should call the
             * flush() method to guarantee all data has been forwarded to
             * the underlying deno.WriterSync.
             */
            BufWriterSync = class BufWriterSync extends AbstractBufBase {
                constructor(writer, size = DEFAULT_BUF_SIZE) {
                    super();
                    this.writer = writer;
                    if (size <= 0) {
                        size = DEFAULT_BUF_SIZE;
                    }
                    this.buf = new Uint8Array(size);
                }
                /** return new BufWriterSync unless writer is BufWriterSync */
                static create(writer, size = DEFAULT_BUF_SIZE) {
                    return writer instanceof BufWriterSync
                        ? writer
                        : new BufWriterSync(writer, size);
                }
                /** Discards any unflushed buffered data, clears any error, and
                 * resets buffer to write its output to w.
                 */
                reset(w) {
                    this.err = null;
                    this.usedBufferBytes = 0;
                    this.writer = w;
                }
                /** Flush writes any buffered data to the underlying io.WriterSync. */
                flush() {
                    if (this.err !== null)
                        throw this.err;
                    if (this.usedBufferBytes === 0)
                        return;
                    try {
                        Deno.writeAllSync(this.writer, this.buf.subarray(0, this.usedBufferBytes));
                    }
                    catch (e) {
                        this.err = e;
                        throw e;
                    }
                    this.buf = new Uint8Array(this.buf.length);
                    this.usedBufferBytes = 0;
                }
                /** Writes the contents of `data` into the buffer.  If the contents won't fully
                 * fit into the buffer, those bytes that can are copied into the buffer, the
                 * buffer is the flushed to the writer and the remaining bytes are copied into
                 * the now empty buffer.
                 *
                 * @return the number of bytes written to the buffer.
                 */
                writeSync(data) {
                    if (this.err !== null)
                        throw this.err;
                    if (data.length === 0)
                        return 0;
                    let totalBytesWritten = 0;
                    let numBytesWritten = 0;
                    while (data.byteLength > this.available()) {
                        if (this.buffered() === 0) {
                            // Large write, empty buffer.
                            // Write directly from data to avoid copy.
                            try {
                                numBytesWritten = this.writer.writeSync(data);
                            }
                            catch (e) {
                                this.err = e;
                                throw e;
                            }
                        }
                        else {
                            numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                            this.usedBufferBytes += numBytesWritten;
                            this.flush();
                        }
                        totalBytesWritten += numBytesWritten;
                        data = data.subarray(numBytesWritten);
                    }
                    numBytesWritten = mod_ts_1.copyBytes(data, this.buf, this.usedBufferBytes);
                    this.usedBufferBytes += numBytesWritten;
                    totalBytesWritten += numBytesWritten;
                    return totalBytesWritten;
                }
            };
            exports_4("BufWriterSync", BufWriterSync);
        }
    };
});
System.register("https://deno.land/std@0.60.0/async/deferred", [], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    /** Creates a Promise with the `reject` and `resolve` functions
     * placed as methods on the promise object itself. It allows you to do:
     *
     *     const p = deferred<number>();
     *     // ...
     *     p.resolve(42);
     */
    function deferred() {
        let methods;
        const promise = new Promise((resolve, reject) => {
            methods = { resolve, reject };
        });
        return Object.assign(promise, methods);
    }
    exports_5("deferred", deferred);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.60.0/async/delay", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
    /* Resolves after the given number of milliseconds. */
    function delay(ms) {
        return new Promise((res) => setTimeout(() => {
            res();
        }, ms));
    }
    exports_6("delay", delay);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.60.0/async/mux_async_iterator", ["https://deno.land/std@0.60.0/async/deferred"], function (exports_7, context_7) {
    "use strict";
    var deferred_ts_1, MuxAsyncIterator;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (deferred_ts_1_1) {
                deferred_ts_1 = deferred_ts_1_1;
            }
        ],
        execute: function () {
            /** The MuxAsyncIterator class multiplexes multiple async iterators into a
             * single stream. It currently makes an assumption:
             * - The final result (the value returned and not yielded from the iterator)
             *   does not matter; if there is any, it is discarded.
             */
            MuxAsyncIterator = class MuxAsyncIterator {
                constructor() {
                    this.iteratorCount = 0;
                    this.yields = [];
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.throws = [];
                    this.signal = deferred_ts_1.deferred();
                }
                add(iterator) {
                    ++this.iteratorCount;
                    this.callIteratorNext(iterator);
                }
                async callIteratorNext(iterator) {
                    try {
                        const { value, done } = await iterator.next();
                        if (done) {
                            --this.iteratorCount;
                        }
                        else {
                            this.yields.push({ iterator, value });
                        }
                    }
                    catch (e) {
                        this.throws.push(e);
                    }
                    this.signal.resolve();
                }
                async *iterate() {
                    while (this.iteratorCount > 0) {
                        // Sleep until any of the wrapped iterators yields.
                        await this.signal;
                        // Note that while we're looping over `yields`, new items may be added.
                        for (let i = 0; i < this.yields.length; i++) {
                            const { iterator, value } = this.yields[i];
                            yield value;
                            this.callIteratorNext(iterator);
                        }
                        if (this.throws.length) {
                            for (const e of this.throws) {
                                throw e;
                            }
                            this.throws.length = 0;
                        }
                        // Clear the `yields` list and reset the `signal` promise.
                        this.yields.length = 0;
                        this.signal = deferred_ts_1.deferred();
                    }
                }
                [Symbol.asyncIterator]() {
                    return this.iterate();
                }
            };
            exports_7("MuxAsyncIterator", MuxAsyncIterator);
        }
    };
});
System.register("https://deno.land/std@0.60.0/async/mod", ["https://deno.land/std@0.60.0/async/deferred", "https://deno.land/std@0.60.0/async/delay", "https://deno.land/std@0.60.0/async/mux_async_iterator"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    function exportStar_1(m) {
        var exports = {};
        for (var n in m) {
            if (n !== "default") exports[n] = m[n];
        }
        exports_8(exports);
    }
    return {
        setters: [
            function (deferred_ts_2_1) {
                exportStar_1(deferred_ts_2_1);
            },
            function (delay_ts_1_1) {
                exportStar_1(delay_ts_1_1);
            },
            function (mux_async_iterator_ts_1_1) {
                exportStar_1(mux_async_iterator_ts_1_1);
            }
        ],
        execute: function () {
        }
    };
});
// Based on https://github.com/golang/go/tree/master/src/net/textproto
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.
System.register("https://deno.land/std@0.60.0/textproto/mod", ["https://deno.land/std@0.60.0/bytes/mod", "https://deno.land/std@0.60.0/encoding/utf8"], function (exports_9, context_9) {
    "use strict";
    var mod_ts_2, utf8_ts_1, invalidHeaderCharRegex, TextProtoReader;
    var __moduleName = context_9 && context_9.id;
    function str(buf) {
        if (buf == null) {
            return "";
        }
        else {
            return utf8_ts_1.decode(buf);
        }
    }
    function charCode(s) {
        return s.charCodeAt(0);
    }
    return {
        setters: [
            function (mod_ts_2_1) {
                mod_ts_2 = mod_ts_2_1;
            },
            function (utf8_ts_1_1) {
                utf8_ts_1 = utf8_ts_1_1;
            }
        ],
        execute: function () {
            // FROM https://github.com/denoland/deno/blob/b34628a26ab0187a827aa4ebe256e23178e25d39/cli/js/web/headers.ts#L9
            invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/g;
            TextProtoReader = class TextProtoReader {
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
                        line = line ? mod_ts_2.concat(line, l) : l;
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
            };
            exports_9("TextProtoReader", TextProtoReader);
        }
    };
});
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register("https://deno.land/std@0.60.0/http/http_status", [], function (exports_10, context_10) {
    "use strict";
    var Status, STATUS_TEXT;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [],
        execute: function () {
            /** HTTP status codes */
            (function (Status) {
                /** RFC 7231, 6.2.1 */
                Status[Status["Continue"] = 100] = "Continue";
                /** RFC 7231, 6.2.2 */
                Status[Status["SwitchingProtocols"] = 101] = "SwitchingProtocols";
                /** RFC 2518, 10.1 */
                Status[Status["Processing"] = 102] = "Processing";
                /** RFC 8297 **/
                Status[Status["EarlyHints"] = 103] = "EarlyHints";
                /** RFC 7231, 6.3.1 */
                Status[Status["OK"] = 200] = "OK";
                /** RFC 7231, 6.3.2 */
                Status[Status["Created"] = 201] = "Created";
                /** RFC 7231, 6.3.3 */
                Status[Status["Accepted"] = 202] = "Accepted";
                /** RFC 7231, 6.3.4 */
                Status[Status["NonAuthoritativeInfo"] = 203] = "NonAuthoritativeInfo";
                /** RFC 7231, 6.3.5 */
                Status[Status["NoContent"] = 204] = "NoContent";
                /** RFC 7231, 6.3.6 */
                Status[Status["ResetContent"] = 205] = "ResetContent";
                /** RFC 7233, 4.1 */
                Status[Status["PartialContent"] = 206] = "PartialContent";
                /** RFC 4918, 11.1 */
                Status[Status["MultiStatus"] = 207] = "MultiStatus";
                /** RFC 5842, 7.1 */
                Status[Status["AlreadyReported"] = 208] = "AlreadyReported";
                /** RFC 3229, 10.4.1 */
                Status[Status["IMUsed"] = 226] = "IMUsed";
                /** RFC 7231, 6.4.1 */
                Status[Status["MultipleChoices"] = 300] = "MultipleChoices";
                /** RFC 7231, 6.4.2 */
                Status[Status["MovedPermanently"] = 301] = "MovedPermanently";
                /** RFC 7231, 6.4.3 */
                Status[Status["Found"] = 302] = "Found";
                /** RFC 7231, 6.4.4 */
                Status[Status["SeeOther"] = 303] = "SeeOther";
                /** RFC 7232, 4.1 */
                Status[Status["NotModified"] = 304] = "NotModified";
                /** RFC 7231, 6.4.5 */
                Status[Status["UseProxy"] = 305] = "UseProxy";
                /** RFC 7231, 6.4.7 */
                Status[Status["TemporaryRedirect"] = 307] = "TemporaryRedirect";
                /** RFC 7538, 3 */
                Status[Status["PermanentRedirect"] = 308] = "PermanentRedirect";
                /** RFC 7231, 6.5.1 */
                Status[Status["BadRequest"] = 400] = "BadRequest";
                /** RFC 7235, 3.1 */
                Status[Status["Unauthorized"] = 401] = "Unauthorized";
                /** RFC 7231, 6.5.2 */
                Status[Status["PaymentRequired"] = 402] = "PaymentRequired";
                /** RFC 7231, 6.5.3 */
                Status[Status["Forbidden"] = 403] = "Forbidden";
                /** RFC 7231, 6.5.4 */
                Status[Status["NotFound"] = 404] = "NotFound";
                /** RFC 7231, 6.5.5 */
                Status[Status["MethodNotAllowed"] = 405] = "MethodNotAllowed";
                /** RFC 7231, 6.5.6 */
                Status[Status["NotAcceptable"] = 406] = "NotAcceptable";
                /** RFC 7235, 3.2 */
                Status[Status["ProxyAuthRequired"] = 407] = "ProxyAuthRequired";
                /** RFC 7231, 6.5.7 */
                Status[Status["RequestTimeout"] = 408] = "RequestTimeout";
                /** RFC 7231, 6.5.8 */
                Status[Status["Conflict"] = 409] = "Conflict";
                /** RFC 7231, 6.5.9 */
                Status[Status["Gone"] = 410] = "Gone";
                /** RFC 7231, 6.5.10 */
                Status[Status["LengthRequired"] = 411] = "LengthRequired";
                /** RFC 7232, 4.2 */
                Status[Status["PreconditionFailed"] = 412] = "PreconditionFailed";
                /** RFC 7231, 6.5.11 */
                Status[Status["RequestEntityTooLarge"] = 413] = "RequestEntityTooLarge";
                /** RFC 7231, 6.5.12 */
                Status[Status["RequestURITooLong"] = 414] = "RequestURITooLong";
                /** RFC 7231, 6.5.13 */
                Status[Status["UnsupportedMediaType"] = 415] = "UnsupportedMediaType";
                /** RFC 7233, 4.4 */
                Status[Status["RequestedRangeNotSatisfiable"] = 416] = "RequestedRangeNotSatisfiable";
                /** RFC 7231, 6.5.14 */
                Status[Status["ExpectationFailed"] = 417] = "ExpectationFailed";
                /** RFC 7168, 2.3.3 */
                Status[Status["Teapot"] = 418] = "Teapot";
                /** RFC 7540, 9.1.2 */
                Status[Status["MisdirectedRequest"] = 421] = "MisdirectedRequest";
                /** RFC 4918, 11.2 */
                Status[Status["UnprocessableEntity"] = 422] = "UnprocessableEntity";
                /** RFC 4918, 11.3 */
                Status[Status["Locked"] = 423] = "Locked";
                /** RFC 4918, 11.4 */
                Status[Status["FailedDependency"] = 424] = "FailedDependency";
                /** RFC 8470, 5.2 */
                Status[Status["TooEarly"] = 425] = "TooEarly";
                /** RFC 7231, 6.5.15 */
                Status[Status["UpgradeRequired"] = 426] = "UpgradeRequired";
                /** RFC 6585, 3 */
                Status[Status["PreconditionRequired"] = 428] = "PreconditionRequired";
                /** RFC 6585, 4 */
                Status[Status["TooManyRequests"] = 429] = "TooManyRequests";
                /** RFC 6585, 5 */
                Status[Status["RequestHeaderFieldsTooLarge"] = 431] = "RequestHeaderFieldsTooLarge";
                /** RFC 7725, 3 */
                Status[Status["UnavailableForLegalReasons"] = 451] = "UnavailableForLegalReasons";
                /** RFC 7231, 6.6.1 */
                Status[Status["InternalServerError"] = 500] = "InternalServerError";
                /** RFC 7231, 6.6.2 */
                Status[Status["NotImplemented"] = 501] = "NotImplemented";
                /** RFC 7231, 6.6.3 */
                Status[Status["BadGateway"] = 502] = "BadGateway";
                /** RFC 7231, 6.6.4 */
                Status[Status["ServiceUnavailable"] = 503] = "ServiceUnavailable";
                /** RFC 7231, 6.6.5 */
                Status[Status["GatewayTimeout"] = 504] = "GatewayTimeout";
                /** RFC 7231, 6.6.6 */
                Status[Status["HTTPVersionNotSupported"] = 505] = "HTTPVersionNotSupported";
                /** RFC 2295, 8.1 */
                Status[Status["VariantAlsoNegotiates"] = 506] = "VariantAlsoNegotiates";
                /** RFC 4918, 11.5 */
                Status[Status["InsufficientStorage"] = 507] = "InsufficientStorage";
                /** RFC 5842, 7.2 */
                Status[Status["LoopDetected"] = 508] = "LoopDetected";
                /** RFC 2774, 7 */
                Status[Status["NotExtended"] = 510] = "NotExtended";
                /** RFC 6585, 6 */
                Status[Status["NetworkAuthenticationRequired"] = 511] = "NetworkAuthenticationRequired";
            })(Status || (Status = {}));
            exports_10("Status", Status);
            exports_10("STATUS_TEXT", STATUS_TEXT = new Map([
                [Status.Continue, "Continue"],
                [Status.SwitchingProtocols, "Switching Protocols"],
                [Status.Processing, "Processing"],
                [Status.EarlyHints, "Early Hints"],
                [Status.OK, "OK"],
                [Status.Created, "Created"],
                [Status.Accepted, "Accepted"],
                [Status.NonAuthoritativeInfo, "Non-Authoritative Information"],
                [Status.NoContent, "No Content"],
                [Status.ResetContent, "Reset Content"],
                [Status.PartialContent, "Partial Content"],
                [Status.MultiStatus, "Multi-Status"],
                [Status.AlreadyReported, "Already Reported"],
                [Status.IMUsed, "IM Used"],
                [Status.MultipleChoices, "Multiple Choices"],
                [Status.MovedPermanently, "Moved Permanently"],
                [Status.Found, "Found"],
                [Status.SeeOther, "See Other"],
                [Status.NotModified, "Not Modified"],
                [Status.UseProxy, "Use Proxy"],
                [Status.TemporaryRedirect, "Temporary Redirect"],
                [Status.PermanentRedirect, "Permanent Redirect"],
                [Status.BadRequest, "Bad Request"],
                [Status.Unauthorized, "Unauthorized"],
                [Status.PaymentRequired, "Payment Required"],
                [Status.Forbidden, "Forbidden"],
                [Status.NotFound, "Not Found"],
                [Status.MethodNotAllowed, "Method Not Allowed"],
                [Status.NotAcceptable, "Not Acceptable"],
                [Status.ProxyAuthRequired, "Proxy Authentication Required"],
                [Status.RequestTimeout, "Request Timeout"],
                [Status.Conflict, "Conflict"],
                [Status.Gone, "Gone"],
                [Status.LengthRequired, "Length Required"],
                [Status.PreconditionFailed, "Precondition Failed"],
                [Status.RequestEntityTooLarge, "Request Entity Too Large"],
                [Status.RequestURITooLong, "Request URI Too Long"],
                [Status.UnsupportedMediaType, "Unsupported Media Type"],
                [Status.RequestedRangeNotSatisfiable, "Requested Range Not Satisfiable"],
                [Status.ExpectationFailed, "Expectation Failed"],
                [Status.Teapot, "I'm a teapot"],
                [Status.MisdirectedRequest, "Misdirected Request"],
                [Status.UnprocessableEntity, "Unprocessable Entity"],
                [Status.Locked, "Locked"],
                [Status.FailedDependency, "Failed Dependency"],
                [Status.TooEarly, "Too Early"],
                [Status.UpgradeRequired, "Upgrade Required"],
                [Status.PreconditionRequired, "Precondition Required"],
                [Status.TooManyRequests, "Too Many Requests"],
                [Status.RequestHeaderFieldsTooLarge, "Request Header Fields Too Large"],
                [Status.UnavailableForLegalReasons, "Unavailable For Legal Reasons"],
                [Status.InternalServerError, "Internal Server Error"],
                [Status.NotImplemented, "Not Implemented"],
                [Status.BadGateway, "Bad Gateway"],
                [Status.ServiceUnavailable, "Service Unavailable"],
                [Status.GatewayTimeout, "Gateway Timeout"],
                [Status.HTTPVersionNotSupported, "HTTP Version Not Supported"],
                [Status.VariantAlsoNegotiates, "Variant Also Negotiates"],
                [Status.InsufficientStorage, "Insufficient Storage"],
                [Status.LoopDetected, "Loop Detected"],
                [Status.NotExtended, "Not Extended"],
                [Status.NetworkAuthenticationRequired, "Network Authentication Required"],
            ]));
        }
    };
});
System.register("https://deno.land/std@0.60.0/http/_io", ["https://deno.land/std@0.60.0/io/bufio", "https://deno.land/std@0.60.0/textproto/mod", "https://deno.land/std@0.60.0/_util/assert", "https://deno.land/std@0.60.0/encoding/utf8", "https://deno.land/std@0.60.0/http/server", "https://deno.land/std@0.60.0/http/http_status"], function (exports_11, context_11) {
    "use strict";
    var bufio_ts_1, mod_ts_3, assert_ts_2, utf8_ts_2, server_ts_1, http_status_ts_1;
    var __moduleName = context_11 && context_11.id;
    function emptyReader() {
        return {
            read(_) {
                return Promise.resolve(null);
            },
        };
    }
    exports_11("emptyReader", emptyReader);
    function bodyReader(contentLength, r) {
        let totalRead = 0;
        let finished = false;
        async function read(buf) {
            if (finished)
                return null;
            let result;
            const remaining = contentLength - totalRead;
            if (remaining >= buf.byteLength) {
                result = await r.read(buf);
            }
            else {
                const readBuf = buf.subarray(0, remaining);
                result = await r.read(readBuf);
            }
            if (result !== null) {
                totalRead += result;
            }
            finished = totalRead === contentLength;
            return result;
        }
        return { read };
    }
    exports_11("bodyReader", bodyReader);
    function chunkedBodyReader(h, r) {
        // Based on https://tools.ietf.org/html/rfc2616#section-19.4.6
        const tp = new mod_ts_3.TextProtoReader(r);
        let finished = false;
        const chunks = [];
        async function read(buf) {
            if (finished)
                return null;
            const [chunk] = chunks;
            if (chunk) {
                const chunkRemaining = chunk.data.byteLength - chunk.offset;
                const readLength = Math.min(chunkRemaining, buf.byteLength);
                for (let i = 0; i < readLength; i++) {
                    buf[i] = chunk.data[chunk.offset + i];
                }
                chunk.offset += readLength;
                if (chunk.offset === chunk.data.byteLength) {
                    chunks.shift();
                    // Consume \r\n;
                    if ((await tp.readLine()) === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                }
                return readLength;
            }
            const line = await tp.readLine();
            if (line === null)
                throw new Deno.errors.UnexpectedEof();
            // TODO: handle chunk extension
            const [chunkSizeString] = line.split(";");
            const chunkSize = parseInt(chunkSizeString, 16);
            if (Number.isNaN(chunkSize) || chunkSize < 0) {
                throw new Error("Invalid chunk size");
            }
            if (chunkSize > 0) {
                if (chunkSize > buf.byteLength) {
                    let eof = await r.readFull(buf);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    const restChunk = new Uint8Array(chunkSize - buf.byteLength);
                    eof = await r.readFull(restChunk);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    else {
                        chunks.push({
                            offset: 0,
                            data: restChunk,
                        });
                    }
                    return buf.byteLength;
                }
                else {
                    const bufToFill = buf.subarray(0, chunkSize);
                    const eof = await r.readFull(bufToFill);
                    if (eof === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    // Consume \r\n
                    if ((await tp.readLine()) === null) {
                        throw new Deno.errors.UnexpectedEof();
                    }
                    return chunkSize;
                }
            }
            else {
                assert_ts_2.assert(chunkSize === 0);
                // Consume \r\n
                if ((await r.readLine()) === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                await readTrailers(h, r);
                finished = true;
                return null;
            }
        }
        return { read };
    }
    exports_11("chunkedBodyReader", chunkedBodyReader);
    function isProhibidedForTrailer(key) {
        const s = new Set(["transfer-encoding", "content-length", "trailer"]);
        return s.has(key.toLowerCase());
    }
    /** Read trailer headers from reader and append values to headers. "trailer"
     * field will be deleted. */
    async function readTrailers(headers, r) {
        const trailers = parseTrailer(headers.get("trailer"));
        if (trailers == null)
            return;
        const trailerNames = [...trailers.keys()];
        const tp = new mod_ts_3.TextProtoReader(r);
        const result = await tp.readMIMEHeader();
        if (result == null) {
            throw new Deno.errors.InvalidData("Missing trailer header.");
        }
        const undeclared = [...result.keys()].filter((k) => !trailerNames.includes(k));
        if (undeclared.length > 0) {
            throw new Deno.errors.InvalidData(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
        }
        for (const [k, v] of result) {
            headers.append(k, v);
        }
        const missingTrailers = trailerNames.filter((k) => !result.has(k));
        if (missingTrailers.length > 0) {
            throw new Deno.errors.InvalidData(`Missing trailers: ${Deno.inspect(missingTrailers)}.`);
        }
        headers.delete("trailer");
    }
    exports_11("readTrailers", readTrailers);
    function parseTrailer(field) {
        if (field == null) {
            return undefined;
        }
        const trailerNames = field.split(",").map((v) => v.trim().toLowerCase());
        if (trailerNames.length === 0) {
            throw new Deno.errors.InvalidData("Empty trailer header.");
        }
        const prohibited = trailerNames.filter((k) => isProhibidedForTrailer(k));
        if (prohibited.length > 0) {
            throw new Deno.errors.InvalidData(`Prohibited trailer names: ${Deno.inspect(prohibited)}.`);
        }
        return new Headers(trailerNames.map((key) => [key, ""]));
    }
    async function writeChunkedBody(w, r) {
        const writer = bufio_ts_1.BufWriter.create(w);
        for await (const chunk of Deno.iter(r)) {
            if (chunk.byteLength <= 0)
                continue;
            const start = utf8_ts_2.encoder.encode(`${chunk.byteLength.toString(16)}\r\n`);
            const end = utf8_ts_2.encoder.encode("\r\n");
            await writer.write(start);
            await writer.write(chunk);
            await writer.write(end);
        }
        const endChunk = utf8_ts_2.encoder.encode("0\r\n\r\n");
        await writer.write(endChunk);
    }
    exports_11("writeChunkedBody", writeChunkedBody);
    /** Write trailer headers to writer. It should mostly should be called after
     * `writeResponse()`. */
    async function writeTrailers(w, headers, trailers) {
        const trailer = headers.get("trailer");
        if (trailer === null) {
            throw new TypeError("Missing trailer header.");
        }
        const transferEncoding = headers.get("transfer-encoding");
        if (transferEncoding === null || !transferEncoding.match(/^chunked/)) {
            throw new TypeError(`Trailers are only allowed for "transfer-encoding: chunked", got "transfer-encoding: ${transferEncoding}".`);
        }
        const writer = bufio_ts_1.BufWriter.create(w);
        const trailerNames = trailer.split(",").map((s) => s.trim().toLowerCase());
        const prohibitedTrailers = trailerNames.filter((k) => isProhibidedForTrailer(k));
        if (prohibitedTrailers.length > 0) {
            throw new TypeError(`Prohibited trailer names: ${Deno.inspect(prohibitedTrailers)}.`);
        }
        const undeclared = [...trailers.keys()].filter((k) => !trailerNames.includes(k));
        if (undeclared.length > 0) {
            throw new TypeError(`Undeclared trailers: ${Deno.inspect(undeclared)}.`);
        }
        for (const [key, value] of trailers) {
            await writer.write(utf8_ts_2.encoder.encode(`${key}: ${value}\r\n`));
        }
        await writer.write(utf8_ts_2.encoder.encode("\r\n"));
        await writer.flush();
    }
    exports_11("writeTrailers", writeTrailers);
    async function writeResponse(w, r) {
        const protoMajor = 1;
        const protoMinor = 1;
        const statusCode = r.status || 200;
        const statusText = http_status_ts_1.STATUS_TEXT.get(statusCode);
        const writer = bufio_ts_1.BufWriter.create(w);
        if (!statusText) {
            throw new Deno.errors.InvalidData("Bad status code");
        }
        if (!r.body) {
            r.body = new Uint8Array();
        }
        if (typeof r.body === "string") {
            r.body = utf8_ts_2.encoder.encode(r.body);
        }
        let out = `HTTP/${protoMajor}.${protoMinor} ${statusCode} ${statusText}\r\n`;
        const headers = r.headers ?? new Headers();
        if (r.body && !headers.get("content-length")) {
            if (r.body instanceof Uint8Array) {
                out += `content-length: ${r.body.byteLength}\r\n`;
            }
            else if (!headers.get("transfer-encoding")) {
                out += "transfer-encoding: chunked\r\n";
            }
        }
        for (const [key, value] of headers) {
            out += `${key}: ${value}\r\n`;
        }
        out += `\r\n`;
        const header = utf8_ts_2.encoder.encode(out);
        const n = await writer.write(header);
        assert_ts_2.assert(n === header.byteLength);
        if (r.body instanceof Uint8Array) {
            const n = await writer.write(r.body);
            assert_ts_2.assert(n === r.body.byteLength);
        }
        else if (headers.has("content-length")) {
            const contentLength = headers.get("content-length");
            assert_ts_2.assert(contentLength != null);
            const bodyLength = parseInt(contentLength);
            const n = await Deno.copy(r.body, writer);
            assert_ts_2.assert(n === bodyLength);
        }
        else {
            await writeChunkedBody(writer, r.body);
        }
        if (r.trailers) {
            const t = await r.trailers();
            await writeTrailers(writer, headers, t);
        }
        await writer.flush();
    }
    exports_11("writeResponse", writeResponse);
    /**
     * ParseHTTPVersion parses a HTTP version string.
     * "HTTP/1.0" returns (1, 0).
     * Ported from https://github.com/golang/go/blob/f5c43b9/src/net/http/request.go#L766-L792
     */
    function parseHTTPVersion(vers) {
        switch (vers) {
            case "HTTP/1.1":
                return [1, 1];
            case "HTTP/1.0":
                return [1, 0];
            default: {
                const Big = 1000000; // arbitrary upper bound
                if (!vers.startsWith("HTTP/")) {
                    break;
                }
                const dot = vers.indexOf(".");
                if (dot < 0) {
                    break;
                }
                const majorStr = vers.substring(vers.indexOf("/") + 1, dot);
                const major = Number(majorStr);
                if (!Number.isInteger(major) || major < 0 || major > Big) {
                    break;
                }
                const minorStr = vers.substring(dot + 1);
                const minor = Number(minorStr);
                if (!Number.isInteger(minor) || minor < 0 || minor > Big) {
                    break;
                }
                return [major, minor];
            }
        }
        throw new Error(`malformed HTTP version ${vers}`);
    }
    exports_11("parseHTTPVersion", parseHTTPVersion);
    async function readRequest(conn, bufr) {
        const tp = new mod_ts_3.TextProtoReader(bufr);
        const firstLine = await tp.readLine(); // e.g. GET /index.html HTTP/1.0
        if (firstLine === null)
            return null;
        const headers = await tp.readMIMEHeader();
        if (headers === null)
            throw new Deno.errors.UnexpectedEof();
        const req = new server_ts_1.ServerRequest();
        req.conn = conn;
        req.r = bufr;
        [req.method, req.url, req.proto] = firstLine.split(" ", 3);
        [req.protoMinor, req.protoMajor] = parseHTTPVersion(req.proto);
        req.headers = headers;
        fixLength(req);
        return req;
    }
    exports_11("readRequest", readRequest);
    function fixLength(req) {
        const contentLength = req.headers.get("Content-Length");
        if (contentLength) {
            const arrClen = contentLength.split(",");
            if (arrClen.length > 1) {
                const distinct = [...new Set(arrClen.map((e) => e.trim()))];
                if (distinct.length > 1) {
                    throw Error("cannot contain multiple Content-Length headers");
                }
                else {
                    req.headers.set("Content-Length", distinct[0]);
                }
            }
            const c = req.headers.get("Content-Length");
            if (req.method === "HEAD" && c && c !== "0") {
                throw Error("http: method cannot contain a Content-Length");
            }
            if (c && req.headers.has("transfer-encoding")) {
                // A sender MUST NOT send a Content-Length header field in any message
                // that contains a Transfer-Encoding header field.
                // rfc: https://tools.ietf.org/html/rfc7230#section-3.3.2
                throw new Error("http: Transfer-Encoding and Content-Length cannot be send together");
            }
        }
    }
    return {
        setters: [
            function (bufio_ts_1_1) {
                bufio_ts_1 = bufio_ts_1_1;
            },
            function (mod_ts_3_1) {
                mod_ts_3 = mod_ts_3_1;
            },
            function (assert_ts_2_1) {
                assert_ts_2 = assert_ts_2_1;
            },
            function (utf8_ts_2_1) {
                utf8_ts_2 = utf8_ts_2_1;
            },
            function (server_ts_1_1) {
                server_ts_1 = server_ts_1_1;
            },
            function (http_status_ts_1_1) {
                http_status_ts_1 = http_status_ts_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/std@0.60.0/http/server", ["https://deno.land/std@0.60.0/encoding/utf8", "https://deno.land/std@0.60.0/io/bufio", "https://deno.land/std@0.60.0/_util/assert", "https://deno.land/std@0.60.0/async/mod", "https://deno.land/std@0.60.0/http/_io"], function (exports_12, context_12) {
    "use strict";
    var utf8_ts_3, bufio_ts_2, assert_ts_3, mod_ts_4, _io_ts_1, ServerRequest, Server;
    var __moduleName = context_12 && context_12.id;
    /**
     * Parse addr from string
     *
     *     const addr = "::1:8000";
     *     parseAddrFromString(addr);
     *
     * @param addr Address string
     */
    function _parseAddrFromStr(addr) {
        let url;
        try {
            url = new URL(`http://${addr}`);
        }
        catch {
            throw new TypeError("Invalid address.");
        }
        if (url.username ||
            url.password ||
            url.pathname != "/" ||
            url.search ||
            url.hash) {
            throw new TypeError("Invalid address.");
        }
        return { hostname: url.hostname, port: Number(url.port) };
    }
    exports_12("_parseAddrFromStr", _parseAddrFromStr);
    /**
     * Create a HTTP server
     *
     *     import { serve } from "https://deno.land/std/http/server.ts";
     *     const body = "Hello World\n";
     *     const server = serve({ port: 8000 });
     *     for await (const req of server) {
     *       req.respond({ body });
     *     }
     */
    function serve(addr) {
        if (typeof addr === "string") {
            addr = _parseAddrFromStr(addr);
        }
        const listener = Deno.listen(addr);
        return new Server(listener);
    }
    exports_12("serve", serve);
    /**
     * Start an HTTP server with given options and request handler
     *
     *     const body = "Hello World\n";
     *     const options = { port: 8000 };
     *     listenAndServe(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServe(addr, handler) {
        const server = serve(addr);
        for await (const request of server) {
            handler(request);
        }
    }
    exports_12("listenAndServe", listenAndServe);
    /**
     * Create an HTTPS server with given options
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     for await (const req of serveTLS(options)) {
     *       req.respond({ body });
     *     }
     *
     * @param options Server configuration
     * @return Async iterable server instance for incoming requests
     */
    function serveTLS(options) {
        const tlsOptions = {
            ...options,
            transport: "tcp",
        };
        const listener = Deno.listenTls(tlsOptions);
        return new Server(listener);
    }
    exports_12("serveTLS", serveTLS);
    /**
     * Start an HTTPS server with given options and request handler
     *
     *     const body = "Hello HTTPS";
     *     const options = {
     *       hostname: "localhost",
     *       port: 443,
     *       certFile: "./path/to/localhost.crt",
     *       keyFile: "./path/to/localhost.key",
     *     };
     *     listenAndServeTLS(options, (req) => {
     *       req.respond({ body });
     *     });
     *
     * @param options Server configuration
     * @param handler Request handler
     */
    async function listenAndServeTLS(options, handler) {
        const server = serveTLS(options);
        for await (const request of server) {
            handler(request);
        }
    }
    exports_12("listenAndServeTLS", listenAndServeTLS);
    return {
        setters: [
            function (utf8_ts_3_1) {
                utf8_ts_3 = utf8_ts_3_1;
            },
            function (bufio_ts_2_1) {
                bufio_ts_2 = bufio_ts_2_1;
            },
            function (assert_ts_3_1) {
                assert_ts_3 = assert_ts_3_1;
            },
            function (mod_ts_4_1) {
                mod_ts_4 = mod_ts_4_1;
            },
            function (_io_ts_1_1) {
                _io_ts_1 = _io_ts_1_1;
            }
        ],
        execute: function () {
            ServerRequest = class ServerRequest {
                constructor() {
                    this.done = mod_ts_4.deferred();
                    this._contentLength = undefined;
                    this._body = null;
                    this.finalized = false;
                }
                /**
                 * Value of Content-Length header.
                 * If null, then content length is invalid or not given (e.g. chunked encoding).
                 */
                get contentLength() {
                    // undefined means not cached.
                    // null means invalid or not provided.
                    if (this._contentLength === undefined) {
                        const cl = this.headers.get("content-length");
                        if (cl) {
                            this._contentLength = parseInt(cl);
                            // Convert NaN to null (as NaN harder to test)
                            if (Number.isNaN(this._contentLength)) {
                                this._contentLength = null;
                            }
                        }
                        else {
                            this._contentLength = null;
                        }
                    }
                    return this._contentLength;
                }
                /**
                 * Body of the request.  The easiest way to consume the body is:
                 *
                 *     const buf: Uint8Array = await Deno.readAll(req.body);
                 */
                get body() {
                    if (!this._body) {
                        if (this.contentLength != null) {
                            this._body = _io_ts_1.bodyReader(this.contentLength, this.r);
                        }
                        else {
                            const transferEncoding = this.headers.get("transfer-encoding");
                            if (transferEncoding != null) {
                                const parts = transferEncoding
                                    .split(",")
                                    .map((e) => e.trim().toLowerCase());
                                assert_ts_3.assert(parts.includes("chunked"), 'transfer-encoding must include "chunked" if content-length is not set');
                                this._body = _io_ts_1.chunkedBodyReader(this.headers, this.r);
                            }
                            else {
                                // Neither content-length nor transfer-encoding: chunked
                                this._body = _io_ts_1.emptyReader();
                            }
                        }
                    }
                    return this._body;
                }
                async respond(r) {
                    let err;
                    try {
                        // Write our response!
                        await _io_ts_1.writeResponse(this.w, r);
                    }
                    catch (e) {
                        try {
                            // Eagerly close on error.
                            this.conn.close();
                        }
                        catch {
                            // Pass
                        }
                        err = e;
                    }
                    // Signal that this request has been processed and the next pipelined
                    // request on the same connection can be accepted.
                    this.done.resolve(err);
                    if (err) {
                        // Error during responding, rethrow.
                        throw err;
                    }
                }
                async finalize() {
                    if (this.finalized)
                        return;
                    // Consume unread body
                    const body = this.body;
                    const buf = new Uint8Array(1024);
                    while ((await body.read(buf)) !== null) {
                        // Pass
                    }
                    this.finalized = true;
                }
            };
            exports_12("ServerRequest", ServerRequest);
            Server = class Server {
                constructor(listener) {
                    this.listener = listener;
                    this.closing = false;
                    this.connections = [];
                }
                close() {
                    this.closing = true;
                    this.listener.close();
                    for (const conn of this.connections) {
                        try {
                            conn.close();
                        }
                        catch (e) {
                            // Connection might have been already closed
                            if (!(e instanceof Deno.errors.BadResource)) {
                                throw e;
                            }
                        }
                    }
                }
                // Yields all HTTP requests on a single TCP connection.
                async *iterateHttpRequests(conn) {
                    const reader = new bufio_ts_2.BufReader(conn);
                    const writer = new bufio_ts_2.BufWriter(conn);
                    while (!this.closing) {
                        let request;
                        try {
                            request = await _io_ts_1.readRequest(conn, reader);
                        }
                        catch (error) {
                            if (error instanceof Deno.errors.InvalidData ||
                                error instanceof Deno.errors.UnexpectedEof) {
                                // An error was thrown while parsing request headers.
                                await _io_ts_1.writeResponse(writer, {
                                    status: 400,
                                    body: utf8_ts_3.encode(`${error.message}\r\n\r\n`),
                                });
                            }
                            break;
                        }
                        if (request === null) {
                            break;
                        }
                        request.w = writer;
                        yield request;
                        // Wait for the request to be processed before we accept a new request on
                        // this connection.
                        const responseError = await request.done;
                        if (responseError) {
                            // Something bad happened during response.
                            // (likely other side closed during pipelined req)
                            // req.done implies this connection already closed, so we can just return.
                            this.untrackConnection(request.conn);
                            return;
                        }
                        // Consume unread body and trailers if receiver didn't consume those data
                        await request.finalize();
                    }
                    this.untrackConnection(conn);
                    try {
                        conn.close();
                    }
                    catch (e) {
                        // might have been already closed
                    }
                }
                trackConnection(conn) {
                    this.connections.push(conn);
                }
                untrackConnection(conn) {
                    const index = this.connections.indexOf(conn);
                    if (index !== -1) {
                        this.connections.splice(index, 1);
                    }
                }
                // Accepts a new TCP connection and yields all HTTP requests that arrive on
                // it. When a connection is accepted, it also creates a new iterator of the
                // same kind and adds it to the request multiplexer so that another TCP
                // connection can be accepted.
                async *acceptConnAndIterateHttpRequests(mux) {
                    if (this.closing)
                        return;
                    // Wait for a new connection.
                    let conn;
                    try {
                        conn = await this.listener.accept();
                    }
                    catch (error) {
                        if (error instanceof Deno.errors.BadResource ||
                            error instanceof Deno.errors.InvalidData ||
                            error instanceof Deno.errors.UnexpectedEof) {
                            return mux.add(this.acceptConnAndIterateHttpRequests(mux));
                        }
                        throw error;
                    }
                    this.trackConnection(conn);
                    // Try to accept another connection and add it to the multiplexer.
                    mux.add(this.acceptConnAndIterateHttpRequests(mux));
                    // Yield the requests that arrive on the just-accepted connection.
                    yield* this.iterateHttpRequests(conn);
                }
                [Symbol.asyncIterator]() {
                    const mux = new mod_ts_4.MuxAsyncIterator();
                    mux.add(this.acceptConnAndIterateHttpRequests(mux));
                    return mux.iterate();
                }
            };
            exports_12("Server", Server);
        }
    };
});
System.register("https://deno.land/std/encoding/utf8", [], function (exports_13, context_13) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_13 && context_13.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
        return encoder.encode(input);
    }
    exports_13("encode", encode);
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
        return decoder.decode(input);
    }
    exports_13("decode", decode);
    return {
        setters: [],
        execute: function () {
            /** A default TextEncoder instance */
            exports_13("encoder", encoder = new TextEncoder());
            /** A default TextDecoder instance */
            exports_13("decoder", decoder = new TextDecoder());
        }
    };
});
System.register("https://deno.land/x/bcrypt@v0.2.1/bcrypt/base64", [], function (exports_14, context_14) {
    "use strict";
    var base64_code, index_64;
    var __moduleName = context_14 && context_14.id;
    function encode(d, len) {
        let off = 0;
        let rs = [];
        let c1 = 0;
        let c2 = 0;
        while (off < len) {
            c1 = d[off++] & 0xff;
            rs.push(base64_code[(c1 >> 2) & 0x3f]);
            c1 = (c1 & 0x03) << 4;
            if (off >= len) {
                rs.push(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 4) & 0x0f;
            rs.push(base64_code[c1 & 0x3f]);
            c1 = (c2 & 0x0f) << 2;
            if (off >= len) {
                rs.push(base64_code[c1 & 0x3f]);
                break;
            }
            c2 = d[off++] & 0xff;
            c1 |= (c2 >> 6) & 0x03;
            rs.push(base64_code[c1 & 0x3f]);
            rs.push(base64_code[c2 & 0x3f]);
        }
        return rs.join("");
    }
    exports_14("encode", encode);
    // x is a single character
    function char64(x) {
        if (x.length > 1) {
            throw new Error("Expected a single character");
        }
        let characterAsciiCode = x.charCodeAt(0);
        if (characterAsciiCode < 0 || characterAsciiCode > index_64.length)
            return -1;
        return index_64[characterAsciiCode];
    }
    function decode(s, maxolen) {
        let rs = [];
        let off = 0;
        let slen = s.length;
        let olen = 0;
        let ret;
        let c1, c2, c3, c4, o;
        if (maxolen <= 0)
            throw new Error("Invalid maxolen");
        while (off < slen - 1 && olen < maxolen) {
            c1 = char64(s.charAt(off++));
            c2 = char64(s.charAt(off++));
            if (c1 === -1 || c2 === -1)
                break;
            o = c1 << 2;
            o |= (c2 & 0x30) >> 4;
            rs.push(o);
            if (++olen >= maxolen || off >= slen)
                break;
            c3 = char64(s.charAt(off++));
            if (c3 === -1)
                break;
            o = (c2 & 0x0f) << 4;
            o |= (c3 & 0x3c) >> 2;
            rs.push(o);
            if (++olen >= maxolen || off >= slen)
                break;
            c4 = char64(s.charAt(off++));
            o = (c3 & 0x03) << 6;
            o |= c4;
            rs.push(o);
            ++olen;
        }
        ret = new Uint8Array(olen);
        for (off = 0; off < olen; off++)
            ret[off] = rs[off];
        return ret;
    }
    exports_14("decode", decode);
    return {
        setters: [],
        execute: function () {
            base64_code = "./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");
            index_64 = new Uint8Array([
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                0,
                1,
                54,
                55,
                56,
                57,
                58,
                59,
                60,
                61,
                62,
                63,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                2,
                3,
                4,
                5,
                6,
                7,
                8,
                9,
                10,
                11,
                12,
                13,
                14,
                15,
                16,
                17,
                18,
                19,
                20,
                21,
                22,
                23,
                24,
                25,
                26,
                27,
                -1,
                -1,
                -1,
                -1,
                -1,
                -1,
                28,
                29,
                30,
                31,
                32,
                33,
                34,
                35,
                36,
                37,
                38,
                39,
                40,
                41,
                42,
                43,
                44,
                45,
                46,
                47,
                48,
                49,
                50,
                51,
                52,
                53,
                -1,
                -1,
                -1,
                -1,
                -1,
            ]);
        }
    };
});
System.register("https://deno.land/x/bcrypt@v0.2.1/bcrypt/bcrypt", ["https://deno.land/std/encoding/utf8", "https://deno.land/x/bcrypt@v0.2.1/bcrypt/base64"], function (exports_15, context_15) {
    "use strict";
    var utf8_ts_4, base64, crypto, GENSALT_DEFAULT_LOG2_ROUNDS, BCRYPT_SALT_LEN, BLOWFISH_NUM_ROUNDS, P_orig, S_orig, bf_crypt_ciphertext, P, S;
    var __moduleName = context_15 && context_15.id;
    function encipher(lr, off) {
        let i = 0;
        let n = 0;
        let l = lr[off];
        let r = lr[off + 1];
        l ^= P[0];
        for (i = 0; i <= BLOWFISH_NUM_ROUNDS - 2;) {
            // Feistel substitution on left word
            n = S[(l >> 24) & 0xff];
            n += S[0x100 | ((l >> 16) & 0xff)];
            n ^= S[0x200 | ((l >> 8) & 0xff)];
            n += S[0x300 | (l & 0xff)];
            r ^= n ^ P[++i];
            // Feistel substitution on right word
            n = S[(r >> 24) & 0xff];
            n += S[0x100 | ((r >> 16) & 0xff)];
            n ^= S[0x200 | ((r >> 8) & 0xff)];
            n += S[0x300 | (r & 0xff)];
            l ^= n ^ P[++i];
        }
        lr[off] = r ^ P[BLOWFISH_NUM_ROUNDS + 1];
        lr[off + 1] = l;
    }
    function streamtoword(data, offp) {
        let word = 0;
        let off = offp[0];
        for (let i = 0; i < 4; i++) {
            word = (word << 8) | (data[off] & 0xff);
            off = (off + 1) % data.length;
        }
        offp[0] = off;
        return word;
    }
    function init_key() {
        P = P_orig.slice();
        S = S_orig.slice();
    }
    function key(key) {
        let i;
        let koffp = new Int32Array([0]);
        let lr = new Int32Array([0, 0]);
        let plen = P.length, slen = S.length;
        for (i = 0; i < plen; i++)
            P[i] = P[i] ^ streamtoword(key, koffp);
        for (i = 0; i < plen; i += 2) {
            encipher(lr, 0);
            P[i] = lr[0];
            P[i + 1] = lr[1];
        }
        for (i = 0; i < slen; i += 2) {
            encipher(lr, 0);
            S[i] = lr[0];
            S[i + 1] = lr[1];
        }
    }
    function ekskey(data, key) {
        let i = 0;
        let koffp = new Int32Array([0]);
        let doffp = new Int32Array([0]);
        let lr = new Int32Array([0, 0]);
        let plen = P.length, slen = S.length;
        for (i = 0; i < plen; i++)
            P[i] = P[i] ^ streamtoword(key, koffp);
        for (i = 0; i < plen; i += 2) {
            lr[0] ^= streamtoword(data, doffp);
            lr[1] ^= streamtoword(data, doffp);
            encipher(lr, 0);
            P[i] = lr[0];
            P[i + 1] = lr[1];
        }
        for (i = 0; i < slen; i += 2) {
            lr[0] ^= streamtoword(data, doffp);
            lr[1] ^= streamtoword(data, doffp);
            encipher(lr, 0);
            S[i] = lr[0];
            S[i + 1] = lr[1];
        }
    }
    function crypt_raw(password, salt, log_rounds, cdata) {
        let rounds = 0;
        let i = 0;
        let j = 0;
        let clen = cdata.length;
        let ret;
        if (log_rounds < 4 || log_rounds > 30) {
            throw new Error("Bad number of rounds");
        }
        rounds = 1 << log_rounds;
        if (salt.length !== BCRYPT_SALT_LEN)
            throw new Error("Bad salt length");
        init_key();
        ekskey(salt, password);
        for (i = 0; i !== rounds; i++) {
            key(password);
            key(salt);
        }
        for (i = 0; i < 64; i++) {
            for (j = 0; j < clen >> 1; j++)
                encipher(cdata, j << 1);
        }
        ret = new Uint8Array(clen * 4);
        for (i = 0, j = 0; i < clen; i++) {
            ret[j++] = (cdata[i] >> 24) & 0xff;
            ret[j++] = (cdata[i] >> 16) & 0xff;
            ret[j++] = (cdata[i] >> 8) & 0xff;
            ret[j++] = cdata[i] & 0xff;
        }
        return ret;
    }
    function hashpw(password, salt = gensalt()) {
        let real_salt;
        let passwordb;
        let saltb;
        let hashed;
        let minor = "";
        let rounds = 0;
        let off = 0;
        let rs = [];
        if (salt.charAt(0) !== "$" || salt.charAt(1) !== "2") {
            throw new Error("Invalid salt version");
        }
        if (salt.charAt(2) === "$")
            off = 3;
        else {
            minor = salt.charAt(2);
            if ((minor.charCodeAt(0) >= "a".charCodeAt(0) &&
                minor.charCodeAt(0) >= "z".charCodeAt(0)) ||
                salt.charAt(3) !== "$") {
                throw new Error("Invalid salt revision");
            }
            off = 4;
        }
        // Extract number of rounds
        if (salt.charAt(off + 2) > "$")
            throw new Error("Missing salt rounds");
        rounds = parseInt(salt.substring(off, off + 2));
        real_salt = salt.substring(off + 3, off + 25);
        passwordb = utf8_ts_4.encode(password + (minor.charCodeAt(0) >= "a".charCodeAt(0) ? "\u0000" : ""));
        saltb = base64.decode(real_salt, BCRYPT_SALT_LEN);
        hashed = crypt_raw(passwordb, saltb, rounds, bf_crypt_ciphertext.slice());
        rs.push("$2");
        if (minor.charCodeAt(0) >= "a".charCodeAt(0))
            rs.push(minor);
        rs.push("$");
        if (rounds < 10)
            rs.push("0");
        if (rounds > 30) {
            throw new Error("rounds exceeds maximum (30)");
        }
        rs.push(rounds.toString());
        rs.push("$");
        rs.push(base64.encode(saltb, saltb.length));
        rs.push(base64.encode(hashed, bf_crypt_ciphertext.length * 4 - 1));
        return rs.join("");
    }
    exports_15("hashpw", hashpw);
    function gensalt(log_rounds = GENSALT_DEFAULT_LOG2_ROUNDS) {
        let rs = [];
        let rnd = new Uint8Array(BCRYPT_SALT_LEN);
        crypto.getRandomValues(rnd);
        rs.push("$2a$");
        if (log_rounds < 10)
            rs.push("0");
        if (log_rounds > 30) {
            throw new Error("log_rounds exceeds maximum (30)");
        }
        rs.push(log_rounds.toString());
        rs.push("$");
        rs.push(base64.encode(rnd, rnd.length));
        return rs.join("");
    }
    exports_15("gensalt", gensalt);
    function checkpw(plaintext, hashed) {
        let hashed_bytes;
        let try_bytes;
        let try_pw = hashpw(plaintext, hashed);
        hashed_bytes = utf8_ts_4.encode(hashed);
        try_bytes = utf8_ts_4.encode(try_pw);
        if (hashed_bytes.length !== try_bytes.length)
            return false;
        let ret = 0;
        for (let i = 0; i < try_bytes.length; i++) {
            ret |= hashed_bytes[i] ^ try_bytes[i];
        }
        return ret === 0;
    }
    exports_15("checkpw", checkpw);
    return {
        setters: [
            function (utf8_ts_4_1) {
                utf8_ts_4 = utf8_ts_4_1;
            },
            function (base64_1) {
                base64 = base64_1;
            }
        ],
        execute: function () {
            crypto = globalThis.crypto;
            // BCrypt parameters
            GENSALT_DEFAULT_LOG2_ROUNDS = 10;
            BCRYPT_SALT_LEN = 16;
            // Blowfish parameters
            BLOWFISH_NUM_ROUNDS = 16;
            P_orig = new Int32Array([
                0x243f6a88,
                0x85a308d3,
                0x13198a2e,
                0x03707344,
                0xa4093822,
                0x299f31d0,
                0x082efa98,
                0xec4e6c89,
                0x452821e6,
                0x38d01377,
                0xbe5466cf,
                0x34e90c6c,
                0xc0ac29b7,
                0xc97c50dd,
                0x3f84d5b5,
                0xb5470917,
                0x9216d5d9,
                0x8979fb1b,
            ]);
            S_orig = new Int32Array([
                0xd1310ba6,
                0x98dfb5ac,
                0x2ffd72db,
                0xd01adfb7,
                0xb8e1afed,
                0x6a267e96,
                0xba7c9045,
                0xf12c7f99,
                0x24a19947,
                0xb3916cf7,
                0x0801f2e2,
                0x858efc16,
                0x636920d8,
                0x71574e69,
                0xa458fea3,
                0xf4933d7e,
                0x0d95748f,
                0x728eb658,
                0x718bcd58,
                0x82154aee,
                0x7b54a41d,
                0xc25a59b5,
                0x9c30d539,
                0x2af26013,
                0xc5d1b023,
                0x286085f0,
                0xca417918,
                0xb8db38ef,
                0x8e79dcb0,
                0x603a180e,
                0x6c9e0e8b,
                0xb01e8a3e,
                0xd71577c1,
                0xbd314b27,
                0x78af2fda,
                0x55605c60,
                0xe65525f3,
                0xaa55ab94,
                0x57489862,
                0x63e81440,
                0x55ca396a,
                0x2aab10b6,
                0xb4cc5c34,
                0x1141e8ce,
                0xa15486af,
                0x7c72e993,
                0xb3ee1411,
                0x636fbc2a,
                0x2ba9c55d,
                0x741831f6,
                0xce5c3e16,
                0x9b87931e,
                0xafd6ba33,
                0x6c24cf5c,
                0x7a325381,
                0x28958677,
                0x3b8f4898,
                0x6b4bb9af,
                0xc4bfe81b,
                0x66282193,
                0x61d809cc,
                0xfb21a991,
                0x487cac60,
                0x5dec8032,
                0xef845d5d,
                0xe98575b1,
                0xdc262302,
                0xeb651b88,
                0x23893e81,
                0xd396acc5,
                0x0f6d6ff3,
                0x83f44239,
                0x2e0b4482,
                0xa4842004,
                0x69c8f04a,
                0x9e1f9b5e,
                0x21c66842,
                0xf6e96c9a,
                0x670c9c61,
                0xabd388f0,
                0x6a51a0d2,
                0xd8542f68,
                0x960fa728,
                0xab5133a3,
                0x6eef0b6c,
                0x137a3be4,
                0xba3bf050,
                0x7efb2a98,
                0xa1f1651d,
                0x39af0176,
                0x66ca593e,
                0x82430e88,
                0x8cee8619,
                0x456f9fb4,
                0x7d84a5c3,
                0x3b8b5ebe,
                0xe06f75d8,
                0x85c12073,
                0x401a449f,
                0x56c16aa6,
                0x4ed3aa62,
                0x363f7706,
                0x1bfedf72,
                0x429b023d,
                0x37d0d724,
                0xd00a1248,
                0xdb0fead3,
                0x49f1c09b,
                0x075372c9,
                0x80991b7b,
                0x25d479d8,
                0xf6e8def7,
                0xe3fe501a,
                0xb6794c3b,
                0x976ce0bd,
                0x04c006ba,
                0xc1a94fb6,
                0x409f60c4,
                0x5e5c9ec2,
                0x196a2463,
                0x68fb6faf,
                0x3e6c53b5,
                0x1339b2eb,
                0x3b52ec6f,
                0x6dfc511f,
                0x9b30952c,
                0xcc814544,
                0xaf5ebd09,
                0xbee3d004,
                0xde334afd,
                0x660f2807,
                0x192e4bb3,
                0xc0cba857,
                0x45c8740f,
                0xd20b5f39,
                0xb9d3fbdb,
                0x5579c0bd,
                0x1a60320a,
                0xd6a100c6,
                0x402c7279,
                0x679f25fe,
                0xfb1fa3cc,
                0x8ea5e9f8,
                0xdb3222f8,
                0x3c7516df,
                0xfd616b15,
                0x2f501ec8,
                0xad0552ab,
                0x323db5fa,
                0xfd238760,
                0x53317b48,
                0x3e00df82,
                0x9e5c57bb,
                0xca6f8ca0,
                0x1a87562e,
                0xdf1769db,
                0xd542a8f6,
                0x287effc3,
                0xac6732c6,
                0x8c4f5573,
                0x695b27b0,
                0xbbca58c8,
                0xe1ffa35d,
                0xb8f011a0,
                0x10fa3d98,
                0xfd2183b8,
                0x4afcb56c,
                0x2dd1d35b,
                0x9a53e479,
                0xb6f84565,
                0xd28e49bc,
                0x4bfb9790,
                0xe1ddf2da,
                0xa4cb7e33,
                0x62fb1341,
                0xcee4c6e8,
                0xef20cada,
                0x36774c01,
                0xd07e9efe,
                0x2bf11fb4,
                0x95dbda4d,
                0xae909198,
                0xeaad8e71,
                0x6b93d5a0,
                0xd08ed1d0,
                0xafc725e0,
                0x8e3c5b2f,
                0x8e7594b7,
                0x8ff6e2fb,
                0xf2122b64,
                0x8888b812,
                0x900df01c,
                0x4fad5ea0,
                0x688fc31c,
                0xd1cff191,
                0xb3a8c1ad,
                0x2f2f2218,
                0xbe0e1777,
                0xea752dfe,
                0x8b021fa1,
                0xe5a0cc0f,
                0xb56f74e8,
                0x18acf3d6,
                0xce89e299,
                0xb4a84fe0,
                0xfd13e0b7,
                0x7cc43b81,
                0xd2ada8d9,
                0x165fa266,
                0x80957705,
                0x93cc7314,
                0x211a1477,
                0xe6ad2065,
                0x77b5fa86,
                0xc75442f5,
                0xfb9d35cf,
                0xebcdaf0c,
                0x7b3e89a0,
                0xd6411bd3,
                0xae1e7e49,
                0x00250e2d,
                0x2071b35e,
                0x226800bb,
                0x57b8e0af,
                0x2464369b,
                0xf009b91e,
                0x5563911d,
                0x59dfa6aa,
                0x78c14389,
                0xd95a537f,
                0x207d5ba2,
                0x02e5b9c5,
                0x83260376,
                0x6295cfa9,
                0x11c81968,
                0x4e734a41,
                0xb3472dca,
                0x7b14a94a,
                0x1b510052,
                0x9a532915,
                0xd60f573f,
                0xbc9bc6e4,
                0x2b60a476,
                0x81e67400,
                0x08ba6fb5,
                0x571be91f,
                0xf296ec6b,
                0x2a0dd915,
                0xb6636521,
                0xe7b9f9b6,
                0xff34052e,
                0xc5855664,
                0x53b02d5d,
                0xa99f8fa1,
                0x08ba4799,
                0x6e85076a,
                0x4b7a70e9,
                0xb5b32944,
                0xdb75092e,
                0xc4192623,
                0xad6ea6b0,
                0x49a7df7d,
                0x9cee60b8,
                0x8fedb266,
                0xecaa8c71,
                0x699a17ff,
                0x5664526c,
                0xc2b19ee1,
                0x193602a5,
                0x75094c29,
                0xa0591340,
                0xe4183a3e,
                0x3f54989a,
                0x5b429d65,
                0x6b8fe4d6,
                0x99f73fd6,
                0xa1d29c07,
                0xefe830f5,
                0x4d2d38e6,
                0xf0255dc1,
                0x4cdd2086,
                0x8470eb26,
                0x6382e9c6,
                0x021ecc5e,
                0x09686b3f,
                0x3ebaefc9,
                0x3c971814,
                0x6b6a70a1,
                0x687f3584,
                0x52a0e286,
                0xb79c5305,
                0xaa500737,
                0x3e07841c,
                0x7fdeae5c,
                0x8e7d44ec,
                0x5716f2b8,
                0xb03ada37,
                0xf0500c0d,
                0xf01c1f04,
                0x0200b3ff,
                0xae0cf51a,
                0x3cb574b2,
                0x25837a58,
                0xdc0921bd,
                0xd19113f9,
                0x7ca92ff6,
                0x94324773,
                0x22f54701,
                0x3ae5e581,
                0x37c2dadc,
                0xc8b57634,
                0x9af3dda7,
                0xa9446146,
                0x0fd0030e,
                0xecc8c73e,
                0xa4751e41,
                0xe238cd99,
                0x3bea0e2f,
                0x3280bba1,
                0x183eb331,
                0x4e548b38,
                0x4f6db908,
                0x6f420d03,
                0xf60a04bf,
                0x2cb81290,
                0x24977c79,
                0x5679b072,
                0xbcaf89af,
                0xde9a771f,
                0xd9930810,
                0xb38bae12,
                0xdccf3f2e,
                0x5512721f,
                0x2e6b7124,
                0x501adde6,
                0x9f84cd87,
                0x7a584718,
                0x7408da17,
                0xbc9f9abc,
                0xe94b7d8c,
                0xec7aec3a,
                0xdb851dfa,
                0x63094366,
                0xc464c3d2,
                0xef1c1847,
                0x3215d908,
                0xdd433b37,
                0x24c2ba16,
                0x12a14d43,
                0x2a65c451,
                0x50940002,
                0x133ae4dd,
                0x71dff89e,
                0x10314e55,
                0x81ac77d6,
                0x5f11199b,
                0x043556f1,
                0xd7a3c76b,
                0x3c11183b,
                0x5924a509,
                0xf28fe6ed,
                0x97f1fbfa,
                0x9ebabf2c,
                0x1e153c6e,
                0x86e34570,
                0xeae96fb1,
                0x860e5e0a,
                0x5a3e2ab3,
                0x771fe71c,
                0x4e3d06fa,
                0x2965dcb9,
                0x99e71d0f,
                0x803e89d6,
                0x5266c825,
                0x2e4cc978,
                0x9c10b36a,
                0xc6150eba,
                0x94e2ea78,
                0xa5fc3c53,
                0x1e0a2df4,
                0xf2f74ea7,
                0x361d2b3d,
                0x1939260f,
                0x19c27960,
                0x5223a708,
                0xf71312b6,
                0xebadfe6e,
                0xeac31f66,
                0xe3bc4595,
                0xa67bc883,
                0xb17f37d1,
                0x018cff28,
                0xc332ddef,
                0xbe6c5aa5,
                0x65582185,
                0x68ab9802,
                0xeecea50f,
                0xdb2f953b,
                0x2aef7dad,
                0x5b6e2f84,
                0x1521b628,
                0x29076170,
                0xecdd4775,
                0x619f1510,
                0x13cca830,
                0xeb61bd96,
                0x0334fe1e,
                0xaa0363cf,
                0xb5735c90,
                0x4c70a239,
                0xd59e9e0b,
                0xcbaade14,
                0xeecc86bc,
                0x60622ca7,
                0x9cab5cab,
                0xb2f3846e,
                0x648b1eaf,
                0x19bdf0ca,
                0xa02369b9,
                0x655abb50,
                0x40685a32,
                0x3c2ab4b3,
                0x319ee9d5,
                0xc021b8f7,
                0x9b540b19,
                0x875fa099,
                0x95f7997e,
                0x623d7da8,
                0xf837889a,
                0x97e32d77,
                0x11ed935f,
                0x16681281,
                0x0e358829,
                0xc7e61fd6,
                0x96dedfa1,
                0x7858ba99,
                0x57f584a5,
                0x1b227263,
                0x9b83c3ff,
                0x1ac24696,
                0xcdb30aeb,
                0x532e3054,
                0x8fd948e4,
                0x6dbc3128,
                0x58ebf2ef,
                0x34c6ffea,
                0xfe28ed61,
                0xee7c3c73,
                0x5d4a14d9,
                0xe864b7e3,
                0x42105d14,
                0x203e13e0,
                0x45eee2b6,
                0xa3aaabea,
                0xdb6c4f15,
                0xfacb4fd0,
                0xc742f442,
                0xef6abbb5,
                0x654f3b1d,
                0x41cd2105,
                0xd81e799e,
                0x86854dc7,
                0xe44b476a,
                0x3d816250,
                0xcf62a1f2,
                0x5b8d2646,
                0xfc8883a0,
                0xc1c7b6a3,
                0x7f1524c3,
                0x69cb7492,
                0x47848a0b,
                0x5692b285,
                0x095bbf00,
                0xad19489d,
                0x1462b174,
                0x23820e00,
                0x58428d2a,
                0x0c55f5ea,
                0x1dadf43e,
                0x233f7061,
                0x3372f092,
                0x8d937e41,
                0xd65fecf1,
                0x6c223bdb,
                0x7cde3759,
                0xcbee7460,
                0x4085f2a7,
                0xce77326e,
                0xa6078084,
                0x19f8509e,
                0xe8efd855,
                0x61d99735,
                0xa969a7aa,
                0xc50c06c2,
                0x5a04abfc,
                0x800bcadc,
                0x9e447a2e,
                0xc3453484,
                0xfdd56705,
                0x0e1e9ec9,
                0xdb73dbd3,
                0x105588cd,
                0x675fda79,
                0xe3674340,
                0xc5c43465,
                0x713e38d8,
                0x3d28f89e,
                0xf16dff20,
                0x153e21e7,
                0x8fb03d4a,
                0xe6e39f2b,
                0xdb83adf7,
                0xe93d5a68,
                0x948140f7,
                0xf64c261c,
                0x94692934,
                0x411520f7,
                0x7602d4f7,
                0xbcf46b2e,
                0xd4a20068,
                0xd4082471,
                0x3320f46a,
                0x43b7d4b7,
                0x500061af,
                0x1e39f62e,
                0x97244546,
                0x14214f74,
                0xbf8b8840,
                0x4d95fc1d,
                0x96b591af,
                0x70f4ddd3,
                0x66a02f45,
                0xbfbc09ec,
                0x03bd9785,
                0x7fac6dd0,
                0x31cb8504,
                0x96eb27b3,
                0x55fd3941,
                0xda2547e6,
                0xabca0a9a,
                0x28507825,
                0x530429f4,
                0x0a2c86da,
                0xe9b66dfb,
                0x68dc1462,
                0xd7486900,
                0x680ec0a4,
                0x27a18dee,
                0x4f3ffea2,
                0xe887ad8c,
                0xb58ce006,
                0x7af4d6b6,
                0xaace1e7c,
                0xd3375fec,
                0xce78a399,
                0x406b2a42,
                0x20fe9e35,
                0xd9f385b9,
                0xee39d7ab,
                0x3b124e8b,
                0x1dc9faf7,
                0x4b6d1856,
                0x26a36631,
                0xeae397b2,
                0x3a6efa74,
                0xdd5b4332,
                0x6841e7f7,
                0xca7820fb,
                0xfb0af54e,
                0xd8feb397,
                0x454056ac,
                0xba489527,
                0x55533a3a,
                0x20838d87,
                0xfe6ba9b7,
                0xd096954b,
                0x55a867bc,
                0xa1159a58,
                0xcca92963,
                0x99e1db33,
                0xa62a4a56,
                0x3f3125f9,
                0x5ef47e1c,
                0x9029317c,
                0xfdf8e802,
                0x04272f70,
                0x80bb155c,
                0x05282ce3,
                0x95c11548,
                0xe4c66d22,
                0x48c1133f,
                0xc70f86dc,
                0x07f9c9ee,
                0x41041f0f,
                0x404779a4,
                0x5d886e17,
                0x325f51eb,
                0xd59bc0d1,
                0xf2bcc18f,
                0x41113564,
                0x257b7834,
                0x602a9c60,
                0xdff8e8a3,
                0x1f636c1b,
                0x0e12b4c2,
                0x02e1329e,
                0xaf664fd1,
                0xcad18115,
                0x6b2395e0,
                0x333e92e1,
                0x3b240b62,
                0xeebeb922,
                0x85b2a20e,
                0xe6ba0d99,
                0xde720c8c,
                0x2da2f728,
                0xd0127845,
                0x95b794fd,
                0x647d0862,
                0xe7ccf5f0,
                0x5449a36f,
                0x877d48fa,
                0xc39dfd27,
                0xf33e8d1e,
                0x0a476341,
                0x992eff74,
                0x3a6f6eab,
                0xf4f8fd37,
                0xa812dc60,
                0xa1ebddf8,
                0x991be14c,
                0xdb6e6b0d,
                0xc67b5510,
                0x6d672c37,
                0x2765d43b,
                0xdcd0e804,
                0xf1290dc7,
                0xcc00ffa3,
                0xb5390f92,
                0x690fed0b,
                0x667b9ffb,
                0xcedb7d9c,
                0xa091cf0b,
                0xd9155ea3,
                0xbb132f88,
                0x515bad24,
                0x7b9479bf,
                0x763bd6eb,
                0x37392eb3,
                0xcc115979,
                0x8026e297,
                0xf42e312d,
                0x6842ada7,
                0xc66a2b3b,
                0x12754ccc,
                0x782ef11c,
                0x6a124237,
                0xb79251e7,
                0x06a1bbe6,
                0x4bfb6350,
                0x1a6b1018,
                0x11caedfa,
                0x3d25bdd8,
                0xe2e1c3c9,
                0x44421659,
                0x0a121386,
                0xd90cec6e,
                0xd5abea2a,
                0x64af674e,
                0xda86a85f,
                0xbebfe988,
                0x64e4c3fe,
                0x9dbc8057,
                0xf0f7c086,
                0x60787bf8,
                0x6003604d,
                0xd1fd8346,
                0xf6381fb0,
                0x7745ae04,
                0xd736fccc,
                0x83426b33,
                0xf01eab71,
                0xb0804187,
                0x3c005e5f,
                0x77a057be,
                0xbde8ae24,
                0x55464299,
                0xbf582e61,
                0x4e58f48f,
                0xf2ddfda2,
                0xf474ef38,
                0x8789bdc2,
                0x5366f9c3,
                0xc8b38e74,
                0xb475f255,
                0x46fcd9b9,
                0x7aeb2661,
                0x8b1ddf84,
                0x846a0e79,
                0x915f95e2,
                0x466e598e,
                0x20b45770,
                0x8cd55591,
                0xc902de4c,
                0xb90bace1,
                0xbb8205d0,
                0x11a86248,
                0x7574a99e,
                0xb77f19b6,
                0xe0a9dc09,
                0x662d09a1,
                0xc4324633,
                0xe85a1f02,
                0x09f0be8c,
                0x4a99a025,
                0x1d6efe10,
                0x1ab93d1d,
                0x0ba5a4df,
                0xa186f20f,
                0x2868f169,
                0xdcb7da83,
                0x573906fe,
                0xa1e2ce9b,
                0x4fcd7f52,
                0x50115e01,
                0xa70683fa,
                0xa002b5c4,
                0x0de6d027,
                0x9af88c27,
                0x773f8641,
                0xc3604c06,
                0x61a806b5,
                0xf0177a28,
                0xc0f586e0,
                0x006058aa,
                0x30dc7d62,
                0x11e69ed7,
                0x2338ea63,
                0x53c2dd94,
                0xc2c21634,
                0xbbcbee56,
                0x90bcb6de,
                0xebfc7da1,
                0xce591d76,
                0x6f05e409,
                0x4b7c0188,
                0x39720a3d,
                0x7c927c24,
                0x86e3725f,
                0x724d9db9,
                0x1ac15bb4,
                0xd39eb8fc,
                0xed545578,
                0x08fca5b5,
                0xd83d7cd3,
                0x4dad0fc4,
                0x1e50ef5e,
                0xb161e6f8,
                0xa28514d9,
                0x6c51133c,
                0x6fd5c7e7,
                0x56e14ec4,
                0x362abfce,
                0xddc6c837,
                0xd79a3234,
                0x92638212,
                0x670efa8e,
                0x406000e0,
                0x3a39ce37,
                0xd3faf5cf,
                0xabc27737,
                0x5ac52d1b,
                0x5cb0679e,
                0x4fa33742,
                0xd3822740,
                0x99bc9bbe,
                0xd5118e9d,
                0xbf0f7315,
                0xd62d1c7e,
                0xc700c47b,
                0xb78c1b6b,
                0x21a19045,
                0xb26eb1be,
                0x6a366eb4,
                0x5748ab2f,
                0xbc946e79,
                0xc6a376d2,
                0x6549c2c8,
                0x530ff8ee,
                0x468dde7d,
                0xd5730a1d,
                0x4cd04dc6,
                0x2939bbdb,
                0xa9ba4650,
                0xac9526e8,
                0xbe5ee304,
                0xa1fad5f0,
                0x6a2d519a,
                0x63ef8ce2,
                0x9a86ee22,
                0xc089c2b8,
                0x43242ef6,
                0xa51e03aa,
                0x9cf2d0a4,
                0x83c061ba,
                0x9be96a4d,
                0x8fe51550,
                0xba645bd6,
                0x2826a2f9,
                0xa73a3ae1,
                0x4ba99586,
                0xef5562e9,
                0xc72fefd3,
                0xf752f7da,
                0x3f046f69,
                0x77fa0a59,
                0x80e4a915,
                0x87b08601,
                0x9b09e6ad,
                0x3b3ee593,
                0xe990fd5a,
                0x9e34d797,
                0x2cf0b7d9,
                0x022b8b51,
                0x96d5ac3a,
                0x017da67d,
                0xd1cf3ed6,
                0x7c7d2d28,
                0x1f9f25cf,
                0xadf2b89b,
                0x5ad6b472,
                0x5a88f54c,
                0xe029ac71,
                0xe019a5e6,
                0x47b0acfd,
                0xed93fa9b,
                0xe8d3c48d,
                0x283b57cc,
                0xf8d56629,
                0x79132e28,
                0x785f0191,
                0xed756055,
                0xf7960e44,
                0xe3d35e8c,
                0x15056dd4,
                0x88f46dba,
                0x03a16125,
                0x0564f0bd,
                0xc3eb9e15,
                0x3c9057a2,
                0x97271aec,
                0xa93a072a,
                0x1b3f6d9b,
                0x1e6321f5,
                0xf59c66fb,
                0x26dcf319,
                0x7533d928,
                0xb155fdf5,
                0x03563482,
                0x8aba3cbb,
                0x28517711,
                0xc20ad9f8,
                0xabcc5167,
                0xccad925f,
                0x4de81751,
                0x3830dc8e,
                0x379d5862,
                0x9320f991,
                0xea7a90c2,
                0xfb3e7bce,
                0x5121ce64,
                0x774fbe32,
                0xa8b6e37e,
                0xc3293d46,
                0x48de5369,
                0x6413e680,
                0xa2ae0810,
                0xdd6db224,
                0x69852dfd,
                0x09072166,
                0xb39a460a,
                0x6445c0dd,
                0x586cdecf,
                0x1c20c8ae,
                0x5bbef7dd,
                0x1b588d40,
                0xccd2017f,
                0x6bb4e3bb,
                0xdda26a7e,
                0x3a59ff45,
                0x3e350a44,
                0xbcb4cdd5,
                0x72eacea8,
                0xfa6484bb,
                0x8d6612ae,
                0xbf3c6f47,
                0xd29be463,
                0x542f5d9e,
                0xaec2771b,
                0xf64e6370,
                0x740e0d8d,
                0xe75b1357,
                0xf8721671,
                0xaf537d5d,
                0x4040cb08,
                0x4eb4e2cc,
                0x34d2466a,
                0x0115af84,
                0xe1b00428,
                0x95983a1d,
                0x06b89fb4,
                0xce6ea048,
                0x6f3f3b82,
                0x3520ab82,
                0x011a1d4b,
                0x277227f8,
                0x611560b1,
                0xe7933fdc,
                0xbb3a792b,
                0x344525bd,
                0xa08839e1,
                0x51ce794b,
                0x2f32c9b7,
                0xa01fbac9,
                0xe01cc87e,
                0xbcc7d1f6,
                0xcf0111c3,
                0xa1e8aac7,
                0x1a908749,
                0xd44fbd9a,
                0xd0dadecb,
                0xd50ada38,
                0x0339c32a,
                0xc6913667,
                0x8df9317c,
                0xe0b12b4f,
                0xf79e59b7,
                0x43f5bb3a,
                0xf2d519ff,
                0x27d9459c,
                0xbf97222c,
                0x15e6fc2a,
                0x0f91fc71,
                0x9b941525,
                0xfae59361,
                0xceb69ceb,
                0xc2a86459,
                0x12baa8d1,
                0xb6c1075e,
                0xe3056a0c,
                0x10d25065,
                0xcb03a442,
                0xe0ec6e0e,
                0x1698db3b,
                0x4c98a0be,
                0x3278e964,
                0x9f1f9532,
                0xe0d392df,
                0xd3a0342b,
                0x8971f21e,
                0x1b0a7441,
                0x4ba3348c,
                0xc5be7120,
                0xc37632d8,
                0xdf359f8d,
                0x9b992f2e,
                0xe60b6f47,
                0x0fe3f11d,
                0xe54cda54,
                0x1edad891,
                0xce6279cf,
                0xcd3e7e6f,
                0x1618b166,
                0xfd2c1d05,
                0x848fd2c5,
                0xf6fb2299,
                0xf523f357,
                0xa6327623,
                0x93a83531,
                0x56cccd02,
                0xacf08162,
                0x5a75ebb5,
                0x6e163697,
                0x88d273cc,
                0xde966292,
                0x81b949d0,
                0x4c50901b,
                0x71c65614,
                0xe6c6c7bd,
                0x327a140a,
                0x45e1d006,
                0xc3f27b9a,
                0xc9aa53fd,
                0x62a80f00,
                0xbb25bfe2,
                0x35bdd2f6,
                0x71126905,
                0xb2040222,
                0xb6cbcf7c,
                0xcd769c2b,
                0x53113ec0,
                0x1640e3d3,
                0x38abbd60,
                0x2547adf0,
                0xba38209c,
                0xf746ce76,
                0x77afa1c5,
                0x20756060,
                0x85cbfe4e,
                0x8ae88dd8,
                0x7aaaf9b0,
                0x4cf9aa7e,
                0x1948c25c,
                0x02fb8a8c,
                0x01c36ae4,
                0xd6ebe1f9,
                0x90d4f869,
                0xa65cdea0,
                0x3f09252d,
                0xc208e69f,
                0xb74e6132,
                0xce77e25b,
                0x578fdfe3,
                0x3ac372e6,
            ]);
            // bcrypt IV: "OrpheanBeholderScryDoubt". The C implementation calls
            // this "ciphertext", but it is really plaintext or an IV. We keep
            // the name to make code comparison easier.
            bf_crypt_ciphertext = new Int32Array([
                0x4f727068,
                0x65616e42,
                0x65686f6c,
                0x64657253,
                0x63727944,
                0x6f756274,
            ]);
        }
    };
});
System.register("https://deno.land/x/bcrypt@v0.2.1/main", ["https://deno.land/x/bcrypt@v0.2.1/bcrypt/bcrypt"], function (exports_16, context_16) {
    "use strict";
    var bcrypt;
    var __moduleName = context_16 && context_16.id;
    /**
     * Generate a hash for the plaintext password
     * Requires --allow-net and --unstable flags
     *
     * @export
     * @param {string} plaintext The password to hash
     * @param {(string | undefined)} [salt=undefined] The salt to use when hashing. Recommended to leave this undefined.
     * @returns {Promise<string>} The hashed password
     */
    async function hash(plaintext, salt = undefined) {
        let worker = new Worker(new URL("worker.ts", context_16.meta.url).toString(), { type: "module", deno: true });
        worker.postMessage({
            action: "hash",
            payload: {
                plaintext,
                salt,
            },
        });
        return new Promise((resolve) => {
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
        });
    }
    exports_16("hash", hash);
    /**
     * Generates a salt using a number of log rounds
     * Requires --allow-net and --unstable flags
     *
     * @export
     * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
     * @returns {Promise<string>} The generated salt
     */
    async function genSalt(log_rounds = undefined) {
        let worker = new Worker(new URL("worker.ts", context_16.meta.url).toString(), { type: "module", deno: true });
        worker.postMessage({
            action: "genSalt",
            payload: {
                log_rounds,
            },
        });
        return new Promise((resolve) => {
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
        });
    }
    exports_16("genSalt", genSalt);
    /**
     * Check if a plaintext password matches a hash
     * Requires --allow-net and --unstable flags
     *
     * @export
     * @param {string} plaintext The plaintext password to check
     * @param {string} hash The hash to compare to
     * @returns {Promise<boolean>} Whether the password matches the hash
     */
    async function compare(plaintext, hash) {
        let worker = new Worker(new URL("worker.ts", context_16.meta.url).toString(), { type: "module", deno: true });
        worker.postMessage({
            action: "compare",
            payload: {
                plaintext,
                hash,
            },
        });
        return new Promise((resolve) => {
            worker.onmessage = (event) => {
                resolve(event.data);
                worker.terminate();
            };
        });
    }
    exports_16("compare", compare);
    /**
     * Check if a plaintext password matches a hash
     * This function is blocking and computationally expensive but requires no additonal flags.
     * Using the async variant is highly recommended.
     *
     * @export
     * @param {string} plaintext The plaintext password to check
     * @param {string} hash The hash to compare to
     * @returns {boolean} Whether the password matches the hash
     */
    function compareSync(plaintext, hash) {
        try {
            return bcrypt.checkpw(plaintext, hash);
        }
        catch {
            return false;
        }
    }
    exports_16("compareSync", compareSync);
    /**
     * Generates a salt using a number of log rounds
     * This function is blocking and computationally expensive but requires no additonal flags.
     * Using the async variant is highly recommended.
     *
     * @export
     * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
     * @returns {string} The generated salt
     */
    function genSaltSync(log_rounds = undefined) {
        return bcrypt.gensalt(log_rounds);
    }
    exports_16("genSaltSync", genSaltSync);
    /**
     * Generate a hash for the plaintext password
     * This function is blocking and computationally expensive but requires no additonal flags.
     * Using the async variant is highly recommended.
     *
     * @export
     * @param {string} plaintext The password to hash
     * @param {(string | undefined)} [salt=undefined] The salt to use when hashing. Recommended to leave this undefined.
     * @returns {string} The hashed password
     */
    function hashSync(plaintext, salt = undefined) {
        return bcrypt.hashpw(plaintext, salt);
    }
    exports_16("hashSync", hashSync);
    return {
        setters: [
            function (bcrypt_1) {
                bcrypt = bcrypt_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("https://deno.land/x/bcrypt@v0.2.1/mod", ["https://deno.land/x/bcrypt@v0.2.1/main"], function (exports_17, context_17) {
    "use strict";
    var __moduleName = context_17 && context_17.id;
    return {
        setters: [
            function (main_ts_1_1) {
                exports_17({
                    "genSalt": main_ts_1_1["genSalt"],
                    "compare": main_ts_1_1["compare"],
                    "hash": main_ts_1_1["hash"],
                    "genSaltSync": main_ts_1_1["genSaltSync"],
                    "compareSync": main_ts_1_1["compareSync"],
                    "hashSync": main_ts_1_1["hashSync"]
                });
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/dusan/test/deno/https/deps", ["https://deno.land/std@0.60.0/http/server", "https://deno.land/x/bcrypt@v0.2.1/mod"], function (exports_18, context_18) {
    "use strict";
    var __moduleName = context_18 && context_18.id;
    return {
        setters: [
            function (server_ts_2_1) {
                exports_18({
                    "listenAndServe": server_ts_2_1["listenAndServe"],
                    "listenAndServeTLS": server_ts_2_1["listenAndServeTLS"],
                    "ServerRequest": server_ts_2_1["ServerRequest"]
                });
            },
            function (bcrypt_2) {
                exports_18("bcrypt", bcrypt_2);
            }
        ],
        execute: function () {
        }
    };
});
System.register("file:///home/dusan/test/deno/https/src/routes/home", [], function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    return {
        setters: [],
        execute: function () {
            exports_19("default", (req) => {
                console.log("HandleHomepage request");
                req.respond({
                    status: 200,
                    body: "This is homepage response!"
                });
            });
        }
    };
});
System.register("file:///home/dusan/test/deno/https/src/routes/api/test", [], function (exports_20, context_20) {
    "use strict";
    var __moduleName = context_20 && context_20.id;
    return {
        setters: [],
        execute: function () {
            exports_20("default", (req) => {
                console.log("handle...", req.url);
                req.respond({
                    status: 200,
                    body: `This is /api/test response!`
                });
            });
        }
    };
});
System.register("file:///home/dusan/test/deno/https/src/routes/404", [], function (exports_21, context_21) {
    "use strict";
    var __moduleName = context_21 && context_21.id;
    return {
        setters: [],
        execute: function () {
            exports_21("default", (req) => {
                console.log("404 page request");
                req.respond({
                    status: 404,
                    body: "404 - Page not found"
                });
            });
        }
    };
});
System.register("file:///home/dusan/test/deno/https/src/routes/api/index", ["file:///home/dusan/test/deno/https/src/routes/api/test", "file:///home/dusan/test/deno/https/src/routes/404"], function (exports_22, context_22) {
    "use strict";
    var test_ts_1, _404_ts_1;
    var __moduleName = context_22 && context_22.id;
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
    return {
        setters: [
            function (test_ts_1_1) {
                test_ts_1 = test_ts_1_1;
            },
            function (_404_ts_1_1) {
                _404_ts_1 = _404_ts_1_1;
            }
        ],
        execute: function () {
            exports_22("default", (req) => {
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
                        return test_ts_1.default(req);
                    default:
                        return _404_ts_1.default(req);
                }
            });
        }
    };
});
System.register("file:///home/dusan/test/deno/https/src/routes/index", ["file:///home/dusan/test/deno/https/src/routes/home", "file:///home/dusan/test/deno/https/src/routes/api/index", "file:///home/dusan/test/deno/https/src/routes/404"], function (exports_23, context_23) {
    "use strict";
    var home_ts_1, index_ts_1, _404_ts_2;
    var __moduleName = context_23 && context_23.id;
    function Router(req) {
        switch (true) {
            case req.url.toLowerCase() === "/":
                return home_ts_1.default(req);
            case req.url.toLowerCase().includes("/api"):
                return index_ts_1.default(req);
            default:
                return _404_ts_2.default(req);
        }
    }
    exports_23("Router", Router);
    return {
        setters: [
            function (home_ts_1_1) {
                home_ts_1 = home_ts_1_1;
            },
            function (index_ts_1_1) {
                index_ts_1 = index_ts_1_1;
            },
            function (_404_ts_2_1) {
                _404_ts_2 = _404_ts_2_1;
            }
        ],
        execute: function () {
        }
    };
});
/**
 * Simple TLS server with DENO
 */
System.register("file:///home/dusan/test/deno/https/src/server", ["file:///home/dusan/test/deno/https/deps", "file:///home/dusan/test/deno/https/src/routes/index"], function (exports_24, context_24) {
    "use strict";
    var deps_ts_1, index_ts_2, certFile, keyFile, options;
    var __moduleName = context_24 && context_24.id;
    return {
        setters: [
            function (deps_ts_1_1) {
                deps_ts_1 = deps_ts_1_1;
            },
            function (index_ts_2_1) {
                index_ts_2 = index_ts_2_1;
            }
        ],
        execute: function () {
            // const certFile:string = config().CERT_FILE
            // const keyFile:string = config().KEY_FILE
            certFile = Deno.env.get("CERT_FILE") || "./cert/server.crt";
            keyFile = Deno.env.get("KEY_FILE") || "./cert/server.pem";
            console.log("certFile...", certFile);
            console.log("keyFile...", keyFile);
            options = {
                hostname: "localhost:8080",
                port: 10443,
            };
            console.log("Starting DENO server on ", options.hostname);
            deps_ts_1.listenAndServe(options.hostname, index_ts_2.Router)
                .then(() => {
                console.log("Deno...returned from listenAndServe");
            });
        }
    };
});

__instantiate("file:///home/dusan/test/deno/https/src/server", false);
