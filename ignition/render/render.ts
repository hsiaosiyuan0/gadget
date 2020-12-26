import path from "path";
import {
  renderContext,
  retrieveModule,
  debug,
  getClientModule,
} from "./launch";
import { PageModule, Route } from "./types";
import { assembleHtml } from "./assemble";

export async function renderSSG(route: Route, staticData: any) {
  const ctx = renderContext();
  ctx.currentRoute = route;

  const pageModule = retrieveModule(route.pattern) as PageModule;

  ctx.pageProps = {
    data: staticData,
  };
  ctx.pageModule = pageModule;

  let outlet = getClientModule("HTML");
  if (ctx.manifest.pageOutletMap) {
    const id = ctx.manifest.pageOutletMap[route.pattern];
    const file = path.resolve(ctx.bundleDir, id + ".js");
    if (file) {
      if (debug()) {
        delete require.cache[file];
      }
      require(file);
      outlet = retrieveModule(id);
    }
  }

  ctx.outlet = outlet;
  return assembleHtml();
}
