export class URL {
  origin: string;
  href: string;

  protocol: string;

  // TODO:
  username?: string;
  password?: string;

  // <host>:<port>
  host?: string;
  // domain name
  hostname?: string;
  port?: string;

  pathname: string;

  search?: string;
  searchParams?: { [k: string]: string };

  hash?: string;
  hashPathname?: string;
  hashParams?: { [k: string]: string };

  constructor({
    protocol,
    hostname,
    port,
    pathname,
    search,
    hash,
  }: {
    protocol: string;
    hostname?: string;
    port?: string;
    pathname: string;
    search?: string;
    hash?: string;
  }) {
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
    return `${this.origin}${this.pathname}${
      this.search ? '?' + this.search : ''
    }${this.hash ? '#' + this.hash : ''}`;
  }

  static encodeParams(params: { [k: string]: string }) {
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

// fast check below regexp via: https://regex101.com/r/ObnDEa/3
const rUrl = /^(?:([^:]+):)\/\/([^\/:]+)?(?::(\d+))?(\/[^?#]*)?(?:\?([^#]*))?(?:#(.*))?$/;

export function parseSearch(str: string) {
  if (str[0] === '?') str = str.slice(1);

  const ret: { [k: string]: string } = {};
  const kv = str.split('&');
  for (let i = 0, len = kv.length; i < len; i++) {
    const p = kv[i].split('=');
    const k = p[0];
    if (k.length === 0) continue;
    ret[decodeURIComponent(k)] = decodeURIComponent(p[1] || '');
  }

  return ret;
}

const rHashMode = /^([^?]+)(\?.*)?$/;
export function parseHash(str: string) {
  if (str[0] === '#') str = str.slice(1);

  const matched = str.match(rHashMode);
  if (matched === null) return false;

  const [_, pathname, search = ''] = matched;
  return {
    pathname,
    search: parseSearch(search),
  };
}

/**
 *
 * @param url a fully qualified URL string or a string starts with `/` represent a path
 * @param base if the url is a `path` then this parameter is required to construct
 *             a fully qualified URL to fulfill the parsing
 */
export function parseUrl(url: string, base?: string): URL | false {
  if (url.startsWith('/')) {
    if (!base) throw new Error('[base] is required when url is a path');

    if (base.endsWith('/')) base = base.slice(0, -1);
    url = base + url;
  }

  const matched = url.match(rUrl);
  if (matched === null) return false;

  const [_, protocol, hostname, port, pathname = '/', search, hash] = matched;
  return new URL({ protocol, hostname, port, pathname, search, hash });
}

export function parseUrlRaiseErr(url: string, base?: string) {
  const u = parseUrl(url, base);
  if (u === false) throw new Error('deformed url: ' + url);
  return u;
}
