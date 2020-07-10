// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
/** This module is browser compatible. */
import { CHAR_UPPERCASE_A, CHAR_LOWERCASE_A, CHAR_UPPERCASE_Z, CHAR_LOWERCASE_Z, CHAR_DOT, CHAR_FORWARD_SLASH, CHAR_BACKWARD_SLASH, } from "./_constants.ts";
export function assertPath(path) {
    if (typeof path !== "string") {
        throw new TypeError(`Path must be a string. Received ${JSON.stringify(path)}`);
    }
}
export function isPosixPathSeparator(code) {
    return code === CHAR_FORWARD_SLASH;
}
export function isPathSeparator(code) {
    return isPosixPathSeparator(code) || code === CHAR_BACKWARD_SLASH;
}
export function isWindowsDeviceRoot(code) {
    return ((code >= CHAR_LOWERCASE_A && code <= CHAR_LOWERCASE_Z) ||
        (code >= CHAR_UPPERCASE_A && code <= CHAR_UPPERCASE_Z));
}
// Resolves . and .. elements in a path with directory names
export function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
    let res = "";
    let lastSegmentLength = 0;
    let lastSlash = -1;
    let dots = 0;
    let code;
    for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len)
            code = path.charCodeAt(i);
        else if (isPathSeparator(code))
            break;
        else
            code = CHAR_FORWARD_SLASH;
        if (isPathSeparator(code)) {
            if (lastSlash === i - 1 || dots === 1) {
                // NOOP
            }
            else if (lastSlash !== i - 1 && dots === 2) {
                if (res.length < 2 ||
                    lastSegmentLength !== 2 ||
                    res.charCodeAt(res.length - 1) !== CHAR_DOT ||
                    res.charCodeAt(res.length - 2) !== CHAR_DOT) {
                    if (res.length > 2) {
                        const lastSlashIndex = res.lastIndexOf(separator);
                        if (lastSlashIndex === -1) {
                            res = "";
                            lastSegmentLength = 0;
                        }
                        else {
                            res = res.slice(0, lastSlashIndex);
                            lastSegmentLength = res.length - 1 - res.lastIndexOf(separator);
                        }
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                    else if (res.length === 2 || res.length === 1) {
                        res = "";
                        lastSegmentLength = 0;
                        lastSlash = i;
                        dots = 0;
                        continue;
                    }
                }
                if (allowAboveRoot) {
                    if (res.length > 0)
                        res += `${separator}..`;
                    else
                        res = "..";
                    lastSegmentLength = 2;
                }
            }
            else {
                if (res.length > 0)
                    res += separator + path.slice(lastSlash + 1, i);
                else
                    res = path.slice(lastSlash + 1, i);
                lastSegmentLength = i - lastSlash - 1;
            }
            lastSlash = i;
            dots = 0;
        }
        else if (code === CHAR_DOT && dots !== -1) {
            ++dots;
        }
        else {
            dots = -1;
        }
    }
    return res;
}
export function _format(sep, pathObject) {
    const dir = pathObject.dir || pathObject.root;
    const base = pathObject.base || (pathObject.name || "") + (pathObject.ext || "");
    if (!dir)
        return base;
    if (dir === pathObject.root)
        return dir + base;
    return dir + sep + base;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpREFBaUQ7QUFDakQsNkRBQTZEO0FBQzdELHlDQUF5QztBQUd6QyxPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLGdCQUFnQixFQUNoQixnQkFBZ0IsRUFDaEIsZ0JBQWdCLEVBQ2hCLFFBQVEsRUFDUixrQkFBa0IsRUFDbEIsbUJBQW1CLEdBQ3BCLE1BQU0saUJBQWlCLENBQUM7QUFFekIsTUFBTSxVQUFVLFVBQVUsQ0FBQyxJQUFZO0lBQ3JDLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFO1FBQzVCLE1BQU0sSUFBSSxTQUFTLENBQ2pCLG1DQUFtQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQzFELENBQUM7S0FDSDtBQUNILENBQUM7QUFFRCxNQUFNLFVBQVUsb0JBQW9CLENBQUMsSUFBWTtJQUMvQyxPQUFPLElBQUksS0FBSyxrQkFBa0IsQ0FBQztBQUNyQyxDQUFDO0FBRUQsTUFBTSxVQUFVLGVBQWUsQ0FBQyxJQUFZO0lBQzFDLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxLQUFLLG1CQUFtQixDQUFDO0FBQ3BFLENBQUM7QUFFRCxNQUFNLFVBQVUsbUJBQW1CLENBQUMsSUFBWTtJQUM5QyxPQUFPLENBQ0wsQ0FBQyxJQUFJLElBQUksZ0JBQWdCLElBQUksSUFBSSxJQUFJLGdCQUFnQixDQUFDO1FBQ3RELENBQUMsSUFBSSxJQUFJLGdCQUFnQixJQUFJLElBQUksSUFBSSxnQkFBZ0IsQ0FBQyxDQUN2RCxDQUFDO0FBQ0osQ0FBQztBQUVELDREQUE0RDtBQUM1RCxNQUFNLFVBQVUsZUFBZSxDQUM3QixJQUFZLEVBQ1osY0FBdUIsRUFDdkIsU0FBaUIsRUFDakIsZUFBMEM7SUFFMUMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2IsSUFBSSxpQkFBaUIsR0FBRyxDQUFD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