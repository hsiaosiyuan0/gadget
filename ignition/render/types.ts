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

export type ModuleMeta = {
  files: string[];
  exports?: { default: any };
};

export type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

export type PageModule = ModuleMeta & {
  exports?: { getInitialProps?: any; html?: string };
};

export interface ExecutionContext {
  root: string;
  publicPath: string;

  bundleDir: string;

  baseModules: PartialRecord<string, string[]>;
  pageModules: PartialRecord<string, string[]>;

  router: {
    basename?: string;
    routes: string[];
  };
}

export interface RenderContext extends ExecutionContext {
  currentRoute: Route;

  doctype?: string;
  headProps?: any;

  pageModule?: PageModule;
  pageProps?: any;

  title: string;
  request: Request;
  ctx?: any;

  // the outlet component
  outlet: any;

  manifest: Manifest;
}

export interface Manifest {
  base: Record<string, string[]>;
  pages: Record<string, string[]>;
  pageOutletMap?: Record<string, string>;
}
