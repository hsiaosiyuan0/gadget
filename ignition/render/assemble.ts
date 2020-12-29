import { renderContext, getClientModule } from "./launch";
import { PartialRecord } from "../../shared";
import type { createElement } from "react";

const NS = "__gadget__";

function concatUrl(origin: string, path: string) {
  return (origin.endsWith("/") ? origin : origin + "/") + path;
}

// load from user-space
const fromCwd = (id: string) => require.resolve(id, { paths: [process.cwd()] });
// eslint-disable-next-line @typescript-eslint/no-var-requires
const React = () => require(fromCwd("react"));
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ReactRender = () => require(fromCwd("react-dom/server"));

export const renderToString: typeof createElement = (() => {
  return (type: any, props?: any, ...children: any[]) =>
    ReactRender().renderToString(
      React().createElement(type, props, children)
    ) as any;
})();

export const renderToStaticMarkup: typeof createElement = (() => {
  return (type: any, props?: any, ...children: any[]) =>
    ReactRender().renderToStaticMarkup(
      React().createElement(type, props, children)
    ) as any;
})();

const retrieveBaseModules = () => {
  const ctx = renderContext();
  const modules = ctx.baseModules;
  const scripts: string[] = [];
  const styles: string[] = [];

  Object.values(modules).forEach((m) =>
    m?.forEach((f) => {
      if (f.endsWith(".js")) scripts.push(concatUrl(ctx.publicPath, f));
      else styles.push(concatUrl(ctx.publicPath, f));
    })
  );

  return {
    scripts,
    styles,
  };
};

const CSRCfg = () => {
  const {
    publicPath,
    pageModules,
    currentRoute,
    router: { routes, basename },
    pageProps,
  } = renderContext();

  const pages: Record<string, string[]> = {};
  routes.forEach((k) => {
    const m = pageModules[k];
    if (m) {
      pages[k] = m.map((f) => concatUrl(publicPath, f));
    }
  });

  return `window["${NS}"]=${JSON.stringify({
    initialProps: pageProps,
    currentRoute,
    pageModules: pages,
    router: {
      basename: basename || "/",
      hash: false,
      routes,
    },
  })};`;
};

function retrievePageModules(
  pageModules: PartialRecord<string, string[]>,
  pattern: string
) {
  const curPage = pageModules[pattern];
  if (!curPage) {
    throw new Error("page not found, route: " + pattern);
  }
  const ctx = renderContext();
  const scripts: string[] = [];
  const styles: string[] = [];
  curPage.forEach((f) => {
    if (f.endsWith(".js")) scripts.push(concatUrl(ctx.publicPath, f));
    else if (f.endsWith(".css")) styles.push(concatUrl(ctx.publicPath, f));
  });
  return { scripts, styles };
}

export const assembleHtml = async () => {
  const ctx = renderContext();
  const { currentRoute, pageModule, pageProps, pageModules, outlet } = ctx;

  if (!pageModule) throw new Error("page module is missing");

  const createElement = React().createElement;
  let app: any = null;
  if (pageProps !== null) {
    const page = pageModule?.exports?.default;
    if (!page) {
      throw new Error(
        "Default exports is missing for Module: " +
          currentRoute.pattern +
          " module: " +
          JSON.stringify(pageModule, null, 2)
      );
    }

    const App = getClientModule("APP");
    app = createElement(App, {
      route: currentRoute,
      page,
      pageProps,
    });
  }

  const baseAssets = retrieveBaseModules();
  const pageAssets = retrievePageModules(pageModules, currentRoute.pattern);

  const html = outlet.exports.default;
  const htmlStr = renderToStaticMarkup(
    html,
    {
      title: ctx.title,
      scripts: [
        { children: CSRCfg() },
        ...baseAssets.scripts,
        ...pageAssets.scripts,
      ],
      styles: [...baseAssets.styles, ...pageAssets.styles],
    },
    createElement("div", { id: NS, key: NS }, app)
  );

  return `${html.doctype}${(htmlStr + "").replace(
    /<title>[^<]*<\/title>/,
    `<title>${ctx.title}</title>`
  )}`;
};
