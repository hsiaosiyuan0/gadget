"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emit = exports.off = exports.once = exports.makeOnceHandler = exports.on = exports.getHandlers = void 0;
const evtHandlers = new Map();
function getHandlers(evt) {
    let hs = evtHandlers.get(evt);
    if (!hs) {
        hs = new Set();
        evtHandlers.set(evt, hs);
    }
    return hs;
}
exports.getHandlers = getHandlers;
function on(evt, handler) {
    const hs = getHandlers(evt);
    hs.add(handler);
}
exports.on = on;
// store the once version of the handlers
// firstly use the handler itself to retrieve a map which records
// the pairs to relate the evt-name to the once-handler
const onceHandlerStore = new Map();
function makeOnceHandler(evt, h) {
    let ehs = onceHandlerStore.get(h);
    if (!ehs) {
        ehs = new Map();
        onceHandlerStore.set(h, ehs);
    }
    // evt-name to once-handler
    let oh = ehs.get(evt);
    if (!oh) {
        oh = (...args) => {
            h(...args);
            off(evt, oh);
        };
        ehs.set(evt, oh);
    }
    return oh;
}
exports.makeOnceHandler = makeOnceHandler;
function once(evt, handler) {
    const oh = makeOnceHandler(evt, handler);
    const hs = getHandlers(evt);
    hs.add(oh);
}
exports.once = once;
function off(evt, handler) {
    if (!handler) {
        evtHandlers.delete(evt);
        return;
    }
    const hs = getHandlers(evt);
    hs.delete(handler);
}
exports.off = off;
function emit(evt, ...args) {
    const hs = getHandlers(evt);
    hs.forEach((h) => h(...args));
}
exports.emit = emit;
//# sourceMappingURL=evt-bus.js.map