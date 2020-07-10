import * as bcrypt from "./bcrypt/bcrypt.ts";
/**
 * Generate a hash for the plaintext password
 * Requires --allow-net and --unstable flags
 *
 * @export
 * @param {string} plaintext The password to hash
 * @param {(string | undefined)} [salt=undefined] The salt to use when hashing. Recommended to leave this undefined.
 * @returns {Promise<string>} The hashed password
 */
export async function hash(plaintext, salt = undefined) {
    let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), { type: "module", deno: true });
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
/**
 * Generates a salt using a number of log rounds
 * Requires --allow-net and --unstable flags
 *
 * @export
 * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {Promise<string>} The generated salt
 */
export async function genSalt(log_rounds = undefined) {
    let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), { type: "module", deno: true });
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
/**
 * Check if a plaintext password matches a hash
 * Requires --allow-net and --unstable flags
 *
 * @export
 * @param {string} plaintext The plaintext password to check
 * @param {string} hash The hash to compare to
 * @returns {Promise<boolean>} Whether the password matches the hash
 */
export async function compare(plaintext, hash) {
    let worker = new Worker(new URL("worker.ts", import.meta.url).toString(), { type: "module", deno: true });
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
export function compareSync(plaintext, hash) {
    try {
        return bcrypt.checkpw(plaintext, hash);
    }
    catch {
        return false;
    }
}
/**
 * Generates a salt using a number of log rounds
 * This function is blocking and computationally expensive but requires no additonal flags.
 * Using the async variant is highly recommended.
 *
 * @export
 * @param {(number | undefined)} [log_rounds=undefined] Number of log rounds to use. Recommended to leave this undefined.
 * @returns {string} The generated salt
 */
export function genSaltSync(log_rounds = undefined) {
    return bcrypt.gensalt(log_rounds);
}
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
export function hashSync(plaintext, salt = undefined) {
    return bcrypt.hashpw(plaintext, salt);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxvQkFBb0IsQ0FBQztBQUU3Qzs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sQ0FBQyxLQUFLLFVBQVUsSUFBSSxDQUN4QixTQUFpQixFQUNqQixPQUEyQixTQUFTO0lBRXBDLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxDQUNyQixJQUFJLEdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFDaEQsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FDL0IsQ0FBQztJQUVGLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFDakIsTUFBTSxFQUFFLE1BQU07UUFDZCxPQUFPLEVBQUU7WUFDUCxTQUFTO1lBQ1QsSUFBSTtTQUNMO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1FBQzdCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLEVBQUUsRUFBRTtZQUMzQixPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3BCLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUNyQixDQUFDLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRDs7Ozs7OztHQU9HO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxPQUFPLENBQzNCLGFBQWlDLFNBQVM7SUFFMUMsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQ3JCLElBQUksR0FBRyxDQUFDLFdBQVcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUNoRCxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUMvQixDQUFDO0lBRUYsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUNqQixNQUFNLEVBQUUsU0FBUztRQUNqQixPQUFPLEVBQUU7WUFDUCxVQUFVO1NBQ1g7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDN0IsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7OztHQVFHO0FBQ0gsTUFBTSxDQUFDLEtBQUssVUFBVSxPQUFPLENBQzNCLFNBQWlCLEVBQ2pCLElBQVk7SUFFWixJQUFJLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FDckIsSUFBSSxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQ2hELEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQy9CLENBQUM7SUFFRixNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ2pCLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE9BQU8sRUFBRTtZQUNQLFNBQVM7WUFDVCxJQUFJO1NBQ0w7S0FDRixDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDN0IsTUFBTSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDcEIsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3JCLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVEOzs7Ozs7Ozs7R0FTRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQUMsU0FBaUIsRUFBRSxJQUFZO0lBQ3pELElBQUk7UUFDRixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hDO0lBQUMsTUFBTTtRQUNOLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDSCxDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLFVBQVUsV0FBVyxDQUN6QixhQUFpQyxTQUFTO0lBRTFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxDQUFDO0FBRUQ7Ozs7Ozs7OztHQVNHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FDdEIsU0FBaUIsRUFDakIsT0FBMkIsU0FBUztJQUVwQyxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3hDLENBQUMifQ==