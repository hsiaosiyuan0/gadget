"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
/**
 * create an new deferred object
 */
function defer() {
    let resolve;
    let reject;
    const promise = new Promise((r1, r2) => {
        resolve = r1;
        reject = r2;
    });
    return {
        done(valueOrReason) {
            if (valueOrReason instanceof Error) {
                reject(valueOrReason);
                return;
            }
            resolve(valueOrReason);
        },
        promise,
    };
}
exports.defer = defer;
//# sourceMappingURL=defer.js.map