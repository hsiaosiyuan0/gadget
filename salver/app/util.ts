import { isObjEqual, trimRight, trimLeft } from "../../shared";
import { config, isHashMode, hasRoute, basename } from "../config";
import { parseUrl, URL, parseUrlRaiseErr } from "../../shared/url";

export interface Href {
  pathname: string;
  // considering that there is no runtime information to reason about whether to
  // process a numeric value from the search parts of URL as number or not,
  // so we should use a conservative strategy when we are trying to pass params
  // via the properties of `query`, which means only the string type is permitted as
  // the type of params to prevent the potential bugs which maybe caused by the
  // mismatch of types
  query?: { [k: string]: string };
}

export interface Route {
  pattern: string;
  href: Href;
}

// @internal
export function hrefToUrl(href: Href, fully = true) {
  let pathname = href.pathname;
  pathname = pathname.startsWith(basename())
    ? pathname
    : trimRight(basename(), ["/"]) + "/" + trimLeft(pathname, ["/"]);
  const u = parseUrlRaiseErr(pathname, config().baseUrl);

  if (href.query) {
    if (!u.searchParams) u.searchParams = {};
    Object.entries(href.query).forEach(([k, v]) => {
      u.searchParams![k] = v;
    });
  }
  let url = "";
  if (isHashMode()) {
    url = `#${u.pathname}${u.search}`;
  } else {
    const search = u.search ? "?" + u.search : "";
    const hash = u.hash ? "#" + u.hash : "";
    url = fully ? u.toString() : `${u.pathname}${search}${hash}`;
  }
  return url;
}

// @internal
export function isHrefEqual(h1: Href, h2: Href) {
  const r1 = urlToRoute(h1.pathname);
  const r2 = urlToRoute(h2.pathname);
  if (r1 === false || r2 === false) return false;

  let q1 = h1.query;
  if (q1 && Object.keys(q1).length === 0) q1 = undefined;
  let q2 = h2.query;
  if (q2 && Object.keys(q2).length === 0) q2 = undefined;
  const p1 = decodeURIComponent(r1.pattern);
  const p2 = decodeURIComponent(r2.pattern);
  return p1 === p2 && isObjEqual(q1, q2);
}

// @internal
export function isLocalUrl(u: URL) {
  const lu = parseUrl(config().baseUrl);
  if (lu === false)
    throw new Error("deformed config.baseUrl: " + config().baseUrl);
  return u.origin === lu.origin;
}

export class IllegalRouteError extends Error {}

/**
 * a url is route if it's:
 * 1. a validate url
 * 2. a local one
 * 3. listed in `config.router.routes`
 *
 * @internal
 * @param url
 */
export function isRouteUrl(url: string | URL, raiseError = false) {
  const u =
    typeof url === "string" ? parseUrlRaiseErr(url, config().baseUrl) : url;

  const local = isLocalUrl(u);
  const isSet = hasRoute(normalizeRoute(u.pathname));

  if (!(local && isSet)) {
    if (raiseError)
      throw new IllegalRouteError("URL is not a legal route: " + url);
    return false;
  }

  return true;
}

// @internal
export function assertIsRouteUrl(url: string | URL) {
  isRouteUrl(url, true);
}

// @internal
export function omitExt(route: string) {
  const dot = route.lastIndexOf(".");
  return dot > 0 ? route.slice(0, dot) : route;
}

// @internal
export function normalizeRoute(route: string) {
  route = omitExt(route);
  if (route.startsWith(basename()))
    route = "/" + trimLeft(route.replace(basename(), ""), ["/"]);
  route = route.endsWith("/") ? route + "index" : route;
  return route;
}

/**
 * convert `url` to its associated `route`, return `false` if
 * url is an external one
 *
 * @internal
 * @param url
 */
export function urlToRoute(url: string | URL): Route | false {
  try {
    const u =
      typeof url === "string" ? parseUrlRaiseErr(url, config().baseUrl) : url;
    assertIsRouteUrl(u);
    const query = u.searchParams || {};
    return {
      pattern: normalizeRoute(u.pathname),
      href: {
        pathname: u.pathname,
        query,
      },
    };
  } catch (error) {
    return false;
  }
}

// @internal
export function hrefToRoute(href: Href): Route | false {
  return urlToRoute(hrefToUrl(href));
}
