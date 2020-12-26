import ChainConfig from "webpack-chain";
import { ConfigFactors } from "./factors";
import {
  useInternalLoader,
  useInternalFile,
  registerLoader,
  builtinModule,
  useInternalModule,
  StringDict,
} from "./util";

export function configScript(
  config: ChainConfig,
  factors: ConfigFactors,
  // comes from the return value of `makeOutlets`
  outlets?: StringDict
) {
  const targets: any = { browsers: factors.browserslist };
  const rule = config.module
    .rule("script")
    .test(/\.(tsx|ts|js|mjs|jsx)$/)
    .exclude.add((resource: string) => {
      return (
        !resource.endsWith(".ts") &&
        !resource.endsWith(".tsx") &&
        /node_modules[\/\\](?!(gadget)[\/\\]).*/.test(resource)
      );
    })
    .end();

  registerLoader("module-loader", useInternalFile("loader/module"));
  rule.use("module").loader("module-loader").options({
    root: factors.project,
    pagesDir: factors.pagesDir,
    outlets,
  });

  useInternalLoader("babel-loader");
  useInternalModule("core-js");
  rule
    .use("babel")
    .loader("babel-loader")
    .options({
      presets: [
        [
          builtinModule("@babel/preset-env"),
          {
            targets,
            useBuiltIns: "usage",
            corejs: 3,
          },
        ],
        [builtinModule("@babel/preset-typescript"), { jsxPragma: "h" }],
      ],
      plugins: [
        builtinModule("@babel/plugin-proposal-class-properties"),
        builtinModule("@babel/plugin-proposal-object-rest-spread"),
        builtinModule("@babel/plugin-proposal-optional-chaining"),
        [builtinModule("@babel/plugin-transform-react-jsx")],
      ],
    });
}
