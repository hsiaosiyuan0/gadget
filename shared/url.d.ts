export declare class URL {
    origin: string;
    href: string;
    protocol: string;
    username?: string;
    password?: string;
    host?: string;
    hostname?: string;
    port?: string;
    pathname: string;
    search?: string;
    searchParams?: {
        [k: string]: string;
    };
    hash?: string;
    hashPathname?: string;
    hashParams?: {
        [k: string]: string;
    };
    constructor({ protocol, hostname, port, pathname, search, hash, }: {
        protocol: string;
        hostname?: string;
        port?: string;
        pathname: string;
        search?: string;
        hash?: string;
    });
    _href(): string;
    static encodeParams(params: {
        [k: string]: string;
    }): string;
    toString(): string;
}
export declare function parseSearch(str: string): {
    [k: string]: string;
};
export declare function parseHash(str: string): false | {
    pathname: string;
    search: {
        [k: string]: string;
    };
};
/**
 *
 * @param url a fully qualified URL string or a string starts with `/` represent a path
 * @param base if the url is a `path` then this parameter is required to construct
 *             a fully qualified URL to fulfill the parsing
 */
export declare function parseUrl(url: string, base?: string): URL | false;
export declare function parseUrlRaiseErr(url: string, base?: string): URL;
