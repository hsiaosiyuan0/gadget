import { ComponentClass } from "react";
import { loadModule } from "./module-loader";

export async function loadPageScript(route: string) {
  return loadModule(route) as Promise<
    Error | { default: ComponentClass; getInitialProps: any }
  >;
}
