"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseUrlRaiseErr = exports.parseUrl = exports.parseHash = exports.parseSearch = exports.URL = void 0;
class URL {
    constructor({ protocol, hostname, port, pathname, search, hash, }) {
        this.hostname = hostname;
        this.port = port;
        this.protocol = protocol;
        this.pathname = pathname;
        this.search = search;
        this.hash = hash;
        this.host = hostname ? `${hostname}${port ? ':' + port : ''}` : undefined;
        this.origin = `${protocol}://${this.host ? this.host : ''}`;
        this.href = this._href();
        this.searchParams = search ? parseSearch(search) : undefined;
    }
    _href() {
        return `${this.origin}${this.pathname}${this.search ? '?' + this.search : ''}${this.hash ? '#' + this.hash : ''}`;
    }
    static encodeParams(params) {
        return Object.entries(params)
            .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
            .join('&');
    }
    toString() {
        if (this.searchParams) {
            this.search = URL.encodeParams(this.searchParams);
        }
        return this._href();
    }
}
exports.URL = URL;
// fast check below regexp via: https://regex101.com/r/ObnDEa/3
const rUrl = /^(?:([^:]+):)\/\/([^\/:]+)?(?::(\d+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;
function parseSearch(str) {
    if (str[0] === '?')
        str = str.slice(1);
    const ret = {};
    const kv = str.split('&');
    for (let i = 0, len = kv.length; i < len; i++) {
        const p = kv[i].split('=');
        const k = p[0];
        if (k.length === 0)
            continue;
        ret[decodeURIComponent(k)] = decodeURIComponent(p[1] || '');
    }
    return ret;
}
exports.parseSearch = parseSearch;
const rHashMode = /^([^?]+)(\?.*)?$/;
function parseHash(str) {
    if (str[0] === '#')
        str = str.slice(1);
    const matched = str.match(rHashMode);
    if (matched === null)
        return false;
    const [_, pathname, search = ''] = matched;
    return {
        pathname,
        search: parseSearch(search),
    };
}
exports.parseHash = parseHash;
/**
 *
 * @param url a fully qualified URL string or a string starts with `/` represent a path
 * @param base if the url is a `path` then this parameter is required to construct
 *             a fully qualified URL to fulfill the parsing
 */
function parseUrl(url, base) {
    if (url.startsWith('/')) {
        if (!base)
            throw new Error('[base] is required when url is a path');
        if (base.endsWith('/'))
            base = base.slice(0, -1);
        url = base + url;
    }
    const matched = url.match(rUrl);
    if (matched === null)
        return false;
    const [_, protocol, hostname, port, pathname = '/', search, hash] = matched;
    return new URL({ protocol, hostname, port, pathname, search, hash });
}
exports.parseUrl = parseUrl;
function parseUrlRaiseErr(url, base) {
    const u = parseUrl(url, base);
    if (u === false)
        throw new Error('deformed url: ' + url);
    return u;
}
exports.parseUrlRaiseErr = parseUrlRaiseErr;
//# sourceMappingURL=url.js.map