"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packToArray = exports.classNames = exports.assertValueInEnum = exports.trimRight = exports.trimLeft = exports.trim = exports.merge = exports.isObject = exports.uniqueArray = exports.isObjEqual = void 0;
function isObjEqual(o1, o2) {
    if (!o1 || !o2)
        return o1 === o2;
    const ks1 = Object.keys(o1);
    const ks2 = Object.keys(o2);
    return (ks1.length > ks2.length ? ks1 : ks2).every((ok1) => o2[ok1] === o1[ok1]);
}
exports.isObjEqual = isObjEqual;
function uniqueArray(...args) {
    let items = [];
    args.forEach((arg) => (items = items.concat(arg)));
    return Array.from(new Set(items));
}
exports.uniqueArray = uniqueArray;
function isObject(o) {
    return o && typeof o === "object";
}
exports.isObject = isObject;
function merge(to, from) {
    Object.keys(from).forEach((k2) => {
        if (isObject(from[k2])) {
            if (!isObject(to[k2])) {
                to[k2] = Array.isArray(from[k2]) ? [] : {};
            }
            merge(to[k2], from[k2]);
        }
        else {
            to[k2] = from[k2];
        }
    });
}
exports.merge = merge;
function trim(str, terminators) {
    let i = 0;
    let j = str.length - 1;
    while (i <= j) {
        let goon = false;
        if (terminators.includes(str[i])) {
            i++;
            goon = true;
        }
        if (terminators.includes(str[j])) {
            j--;
            goon = true;
        }
        if (!goon)
            break;
    }
    if (i > j)
        return "";
    return str.slice(i, j + 1);
}
exports.trim = trim;
function trimLeft(str, terminators) {
    let i = 0;
    const len = str.length;
    for (; i < len; i++) {
        if (!terminators.includes(str[i]))
            break;
    }
    return str.slice(i);
}
exports.trimLeft = trimLeft;
function trimRight(str, terminators) {
    const len = str.length;
    let i = len - 1;
    for (; i >= 0; i--) {
        if (!terminators.includes(str[i]))
            break;
    }
    return str.slice(0, i + 1);
}
exports.trimRight = trimRight;
function assertValueInEnum(value, enumValues) {
    const ok = enumValues.includes(value);
    if (ok)
        return value;
    throw new Error(`${value} is not in Enum [${enumValues.join(", ")}]`);
}
exports.assertValueInEnum = assertValueInEnum;
function classNames(names) {
    return names.filter((n) => !!n).join(" ");
}
exports.classNames = classNames;
function packToArray(stuff) {
    if (stuff === undefined)
        return [];
    if (Array.isArray(stuff))
        return stuff;
    return [stuff];
}
exports.packToArray = packToArray;
__exportStar(require("./defer"), exports);
__exportStar(require("./evt-bus"), exports);
__exportStar(require("./resultify"), exports);
__exportStar(require("./url"), exports);
//# sourceMappingURL=index.js.map