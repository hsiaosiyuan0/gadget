import ChainConfig from "webpack-chain";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { ConfigFactors } from "./factors";
import { useInternalLoader, requireInternalModule } from "./util";

export function configPureCss(config: ChainConfig, factors: ConfigFactors) {
  const rule = config.module.rule("pureCss").test(/\.pure\.css/);

  rule.use("minCssExtract").loader(MiniCssExtractPlugin.loader);

  useInternalLoader("css-loader");
  rule
    .use("css")
    .loader("css-loader")
    .options({
      importLoaders: 1,
      sourceMap: true,
      modules: {
        mode: "pure",
      },
    });

  useInternalLoader("postcss-loader");
  rule
    .use("postcss")
    .loader("postcss-loader")
    .options({
      ident: "postcss",
      sourceMap: true,
      plugins: () => [
        requireInternalModule("autoprefixer")({
          overrideBrowserslist: factors.browserslist,
        }),
      ],
    });

  config
    .plugin("minCssExtract")
    .use(MiniCssExtractPlugin, [
      { filename: "[name].css", chunkFilename: "[id].css" },
    ]);
}

export function configPureScss(config: ChainConfig, factors: ConfigFactors) {
  const rule = config.module.rule("pureScss").test(/(\.pure)\.scss/);

  rule.use("minCssExtract").loader(MiniCssExtractPlugin.loader);

  useInternalLoader("css-loader");
  rule
    .use("css")
    .loader("css-loader")
    .options({
      importLoaders: 2,
      sourceMap: true,
      modules: {
        mode: "pure",
      },
    });

  useInternalLoader("postcss-loader");
  rule
    .use("postcss")
    .loader("postcss-loader")
    .options({
      sourceMap: true,
      postcssOptions: {
        ident: "postcss",
        plugins: [
          requireInternalModule("autoprefixer")({
            overrideBrowserslist: factors.browserslist,
          }),
        ],
      },
    });

  useInternalLoader("sass-loader");
  rule.use("scss").loader("sass-loader");

  config
    .plugin("minCssExtract")
    .use(MiniCssExtractPlugin, [
      { filename: "[name].css", chunkFilename: "[id].css" },
    ]);
}

export function configScss(config: ChainConfig, factors: ConfigFactors) {
  const rule = config.module.rule("scss").test(/(?<!\.pure)\.scss/);

  rule.use("minCssExtract").loader(MiniCssExtractPlugin.loader);

  useInternalLoader("css-loader");
  rule.use("css").loader("css-loader").options({
    importLoaders: 2,
  });

  useInternalLoader("postcss-loader");
  rule
    .use("postcss")
    .loader("postcss-loader")
    .options({
      sourceMap: true,
      postcssOptions: {
        ident: "postcss",
        plugins: [
          requireInternalModule("autoprefixer")({
            overrideBrowserslist: factors.browserslist,
          }),
        ],
      },
    });

  useInternalLoader("sass-loader");
  rule.use("scss").loader("sass-loader");

  config
    .plugin("minCssExtract")
    .use(MiniCssExtractPlugin, [
      { filename: "[name].css", chunkFilename: "[id].css" },
    ]);
}

export function configCss(config: ChainConfig, factors: ConfigFactors) {
  const rule = config.module.rule("pureCss").test(/(?<!\.pure)\.css/);

  rule.use("minCssExtract").loader(MiniCssExtractPlugin.loader);

  useInternalLoader("css-loader");
  rule.use("css").loader("css-loader").options({
    importLoaders: 1,
    sourceMap: true,
  });

  useInternalLoader("postcss-loader");
  rule
    .use("postcss")
    .loader("postcss-loader")
    .options({
      ident: "postcss",
      sourceMap: true,
      plugins: () => [
        requireInternalModule("autoprefixer")({
          overrideBrowserslist: factors.browserslist,
        }),
      ],
    });

  config
    .plugin("minCssExtract")
    .use(MiniCssExtractPlugin, [
      { filename: "[name].css", chunkFilename: "[id].css" },
    ]);
}
