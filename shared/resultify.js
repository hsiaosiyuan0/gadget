"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resultify = void 0;
async function resultify(p) {
    if (p instanceof Promise) {
        return p
            .then((r) => {
            return { r, e: null, take: () => r };
        })
            .catch((e) => {
            return {
                r: null,
                e,
                take: () => {
                    throw e;
                },
            };
        });
    }
    try {
        const r = p();
        return Promise.resolve({ r, e: null, take: () => r });
    }
    catch (e) {
        return Promise.resolve({
            r: null,
            e,
            take: () => {
                throw e;
            },
        });
    }
}
exports.resultify = resultify;
//# sourceMappingURL=resultify.js.map