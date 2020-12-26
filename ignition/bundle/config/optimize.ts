import ChainConfig from "webpack-chain";
import { ConfigFactors } from "./factors";

export function configOptimize(config: ChainConfig, factors: ConfigFactors) {
  // share only one webpack runtime among multiple entries
  // see https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
  config.optimization.runtimeChunk({
    name: "foundation",
  });

  config.optimization.splitChunks({
    chunks: "all",
    cacheGroups: {
      default: false,
      vendors: false,

      defaultVendors: {
        reuseExistingChunk: true,
        idHint: "shared",
      },

      // foundation: encapsulate the fundamental modules
      foundation: {
        chunks: "all",
        name: "foundation",
        maxInitialRequests: 25,
        maxSize: factors.mode === "production" ? (1 << 10) * 160 : undefined,
        test(module: any) {
          if (!module.resource) return false;

          return /node_modules[/\\](react|react-dom|prop-types|scheduler|core-js|regenerator-runtime)/.test(
            module.resource
          );
        },
        priority: 50,
        enforce: true,
      },

      // lib: encapsulate the medium level modules
      lib: {
        chunks: "all",
        name: "lib",
        test(module: any) {
          return /node_modules[/\\]/.test(module.resource);
        },
        priority: 20,
        minChunks: 1,
        reuseExistingChunk: true,
      },

      // shared: common parts among the users' modules
      shared: {
        chunks: "all",
        name: "shared",
        priority: 10,
        minChunks: 2,
        reuseExistingChunk: true,
      },
    },
  });
}
