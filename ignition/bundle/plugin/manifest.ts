import webpack from "webpack";

const pluginName = "GadgetManifestPlugin";

export const manifestFilename = "manifest.json";

function filename(nameWithSuffix: string) {
  const dot = nameWithSuffix.indexOf(".");
  return dot !== -1 ? nameWithSuffix.slice(0, dot) : nameWithSuffix;
}

// relate the routes to the files of their associated page
export class GadgetManifestPlugin {
  pageOutletMap?: Record<string, string>;

  constructor(pageOutletMap?: Record<string, string>) {
    this.pageOutletMap = pageOutletMap;
  }

  apply(compiler: webpack.Compiler) {
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: pluginName,
          stage:
            webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_COMPATIBILITY,
        },
        async (chunks) => {
          const options = compiler.options.optimization?.splitChunks;
          if (!options) return;

          const delimiter = options.automaticNameDelimiter!;

          const baseChunkGroupNames = ["foundation", "lib", "app", "shared"];
          const baseChunkGroupMap: Record<string, string[]> = {};
          const pages: Record<string, string[]> = {};

          Object.entries(chunks).forEach((chunk) => {
            const sourceName = chunk[0];

            let [name] = sourceName.split(delimiter);
            name = filename(name);

            if (baseChunkGroupNames.includes(name)) {
              let files = baseChunkGroupMap[name];
              if (!files) {
                files = [];
                baseChunkGroupMap[name] = files;
              }
              files.push(sourceName);
            } else if (name.startsWith("pages/")) {
              let route = name.replace(/^pages/, "");
              if (!route.startsWith("/")) route = "/" + route;

              let files = pages[route];
              if (!files) {
                files = [];
                pages[route] = files;
              }
              files.push(sourceName);
            }
          });

          const info: any = {
            base: baseChunkGroupMap,
            pages,
          };
          if (this.pageOutletMap) {
            info.pageOutletMap = this.pageOutletMap;
          }

          compilation.assets[manifestFilename] = new webpack.sources.RawSource(
            JSON.stringify(info, null, 2),
            true
          );
        }
      );
    });
  }
}
