import { assert } from "../_util/assert.ts";
const DEFAULT_BUFFER_SIZE = 32 * 1024;
/** copy N size at the most.
 *  If read size is lesser than N, then returns nread
 * */
export async function copyN(r, dest, size) {
    let bytesRead = 0;
    let buf = new Uint8Array(DEFAULT_BUFFER_SIZE);
    while (bytesRead < size) {
        if (size - bytesRead < DEFAULT_BUFFER_SIZE) {
            buf = new Uint8Array(size - bytesRead);
        }
        const result = await r.read(buf);
        const nread = result ?? 0;
        bytesRead += nread;
        if (nread > 0) {
            let n = 0;
            while (n < nread) {
                n += await dest.write(buf.slice(n, nread));
            }
            assert(n === nread, "could not write");
        }
        if (result === null) {
            break;
        }
    }
    return bytesRead;
}
/** Read big endian 16bit short from BufReader */
export async function readShort(buf) {
    const high = await buf.readByte();
    if (high === null)
        return null;
    const low = await buf.readByte();
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    return (high << 8) | low;
}
/** Read big endian 32bit integer from BufReader */
export async function readInt(buf) {
    const high = await readShort(buf);
    if (high === null)
        return null;
    const low = await readShort(buf);
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    return (high << 16) | low;
}
const MAX_SAFE_INTEGER = BigInt(Number.MAX_SAFE_INTEGER);
/** Read big endian 64bit long from BufReader */
export async function readLong(buf) {
    const high = await readInt(buf);
    if (high === null)
        return null;
    const low = await readInt(buf);
    if (low === null)
        throw new Deno.errors.UnexpectedEof();
    const big = (BigInt(high) << 32n) | BigInt(low);
    // We probably should provide a similar API that returns BigInt values.
    if (big > MAX_SAFE_INTEGER) {
        throw new RangeError("Long value too big to be represented as a JavaScript number.");
    }
    return Number(big);
}
/** Slice number into 64bit big endian byte array */
export function sliceLongToBytes(d, dest = new Array(8)) {
    let big = BigInt(d);
    for (let i = 0; i < 8; i++) {
        dest[7 - i] = Number(big & 0xffn);
        big >>= 8n;
    }
    return dest;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiaW91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUU1QyxNQUFNLG1CQUFtQixHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFdEM7O0tBRUs7QUFDTCxNQUFNLENBQUMsS0FBSyxVQUFVLEtBQUssQ0FDekIsQ0FBUyxFQUNULElBQVksRUFDWixJQUFZO0lBRVosSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksR0FBRyxHQUFHLElBQUksVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDOUMsT0FBTyxTQUFTLEdBQUcsSUFBSSxFQUFFO1FBQ3ZCLElBQUksSUFBSSxHQUFHLFNBQVMsR0FBRyxtQkFBbUIsRUFBRTtZQUMxQyxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQyxDQUFDO1NBQ3hDO1FBQ0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFDMUIsU0FBUyxJQUFJLEtBQUssQ0FBQztRQUNuQixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDVixPQUFPLENBQUMsR0FBRyxLQUFLLEVBQUU7Z0JBQ2hCLENBQUMsSUFBSSxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQzthQUM1QztZQUNELE1BQU0sQ0FBQyxDQUFDLEtBQUssS0FBSyxFQUFFLGlCQUFpQixDQUFDLENBQUM7U0FDeEM7UUFDRCxJQUFJLE1BQU0sS0FBSyxJQUFJLEVBQUU7WUFDbkIsTUFBTTtTQUNQO0tBQ0Y7SUFDRCxPQUFPLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRUQsaURBQWlEO0FBQ2pELE1BQU0sQ0FBQyxLQUFLLFVBQVUsU0FBUyxDQUFDLEdBQWM7SUFDNUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEMsSUFBSSxJQUFJLEtBQUssSUFBSTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2pDLElBQUksR0FBRyxLQUFLLElBQUk7UUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN4RCxPQUFPLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUMzQixDQUFDO0FBRUQsbURBQW1EO0FBQ25ELE1BQU0sQ0FBQyxLQUFLLFVBQVUsT0FBTyxDQUFDLEdBQWM7SUFDMUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEMsSUFBSSxJQUFJLEtBQUssSUFBSTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2pDLElBQUksR0FBRyxLQUFLLElBQUk7UUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN4RCxPQUFPLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztBQUM1QixDQUFDO0FBRUQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFFekQsZ0RBQWdEO0FBQ2hELE1BQU0sQ0FBQyxLQUFLLFVBQVUsUUFBUSxDQUFDLEdBQWM7SUFDM0MsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEMsSUFBSSxJQUFJLEtBQUssSUFBSTtRQUFFLE9BQU8sSUFBSSxDQUFDO0lBQy9CLE1BQU0sR0FBRyxHQUFHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQy9CLElBQUksR0FBRyxLQUFLLElBQUk7UUFBRSxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUN4RCxNQUFNLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDaEQsdUVBQXVFO0lBQ3ZFLElBQUksR0FBRyxHQUFHLGdCQUFnQixFQUFFO1FBQzFCLE1BQU0sSUFBSSxVQUFVLENBQ2xCLDhEQUE4RCxDQUMvRCxDQUFDO0tBQ0g7SUFDRCxPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBRUQsb0RBQW9EO0FBQ3BELE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxDQUFTLEVBQUUsSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RCxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMxQixJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDbEMsR0FBRyxLQUFLLEVBQUUsQ0FBQztLQUNaO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDIn0=