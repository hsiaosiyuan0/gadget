import React, { ComponentClass, Component, createElement } from "react";
import { render, hydrate } from "react-dom";
import { emit, on, off, parseUrlRaiseErr } from "../../shared";
import { waitModuleLoaded } from "./module-loader";
import {
  mountPoint,
  initialProps,
  NS,
  IS_CLIENT,
  IS_SERVER,
  useModule,
} from "../config";
import { loadPageScript } from "./page-loader";
import {
  Href,
  isHrefEqual,
  Route,
  hrefToUrl,
  assertIsRouteUrl,
  hrefToRoute,
  urlToRoute,
} from "./util";

export const EventAfterRouteChanged = Symbol("after-route-changed");
export const EventBeforeRouteChanged = Symbol("before-route-changed");

let curRoute: Route = { pattern: "/", href: { pathname: "/" } };

export function getCurRoute() {
  if (IS_CLIENT()) return curRoute;

  return (global as any)[NS].currentRoute;
}

export function pushHistory(href: string | Href) {
  if (IS_SERVER()) return;

  if (typeof href === "string") {
    href = {
      pathname: href,
    };
  }

  // ensure pathname is a legal route
  assertIsRouteUrl(href.pathname);

  const route = hrefToRoute(href);
  if (!isHrefEqual(href, curRoute.href)) {
    emit(EventBeforeRouteChanged, route, curRoute);
    window.history.pushState(route, "", hrefToUrl(href));
  }
}

export interface AppProps {
  route: Route;
  page: ComponentClass;
  pageProps: any;
}

export interface AppState {
  route: Route;
  page: ComponentClass;
  pageProps: any;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {
      route: props.route,
      page: props.page,
      pageProps: props.pageProps,
    };
  }

  componentDidMount() {
    this.listen();
  }

  componentWillUnmount() {
    this.drop();
  }

  listen() {
    window.addEventListener("popstate", this.handlePopStateChange);
    on(EventBeforeRouteChanged, this.handleRouteChangeBefore);
  }

  drop() {
    window.removeEventListener("popstate", this.handlePopStateChange);
    off(EventBeforeRouteChanged, this.handleRouteChangeBefore);
  }

  handlePopStateChange = (evt: PopStateEvent) => {
    if (evt.state) emit(EventBeforeRouteChanged, evt.state, curRoute);
  };

  handleRouteChangeBefore = async (route: Route) => {
    const pageModule = await loadPageScript(route.pattern);
    if (pageModule instanceof Error) throw pageModule;

    const page = pageModule.default;

    let props: any = {};
    let pattern = route.pattern;
    pattern = pattern.startsWith("/") ? pattern.slice(1) : pattern;
    pattern = "/_data/" + pattern;
    const resp = await fetch(
      `${hrefToUrl({ pathname: pattern })}.json`
    ).then((resp) => resp.json());

    props.data = resp.data;
    emit(EventAfterRouteChanged, route, curRoute);
    curRoute = route;
    this.setState({ route, page, pageProps: props });
  };

  render() {
    const { page, pageProps } = this.state;
    return createElement(page, pageProps);
  }
}

function recoverRoute() {
  const url = window.location.href;
  const u = parseUrlRaiseErr(url);
  assertIsRouteUrl(u);
  const route = urlToRoute(u);
  if (route) {
    curRoute = route;
    window.history.replaceState(curRoute, "", url);
  }
}

async function bootstrap() {
  recoverRoute();

  waitModuleLoaded(curRoute.pattern, async (module) => {
    let page = module.default;

    let props = initialProps();
    if (props && props.error) return;

    // use `render` instead of `hydrate` when either in pure-csr or in ssr but
    // `getInitialProps` was failed in server side
    //
    // if we keep using `hydrate` despite `getInitialProps` was failed in server side
    // then we'll meet the `content did not match` error
    const r = props === null ? render : hydrate;
    try {
      r(
        <App route={curRoute} page={page} pageProps={props} />,
        document.getElementById(mountPoint())!
      );
    } catch (error) {
      console.log(error);
    }
  });

  // we do not need to load the page for the initial route since
  // the related page scripts was embedded in the response html
  // of the SSR routine, however this initial page loading is
  // necessary for the pure CSR routine
  //
  // `loadPageScript` will take its internally maintained loading
  // scripts with the script tags in the response html to prevent
  // loading one script repeatedly
  loadPageScript(curRoute.pattern);
}

if (IS_CLIENT()) {
  try {
    bootstrap();
  } catch (error) {
    console.error("Failed to bootstrap: ", error);
  }
}

// register to outside module manager
useModule("APP", App);
useModule("REACT", React);
