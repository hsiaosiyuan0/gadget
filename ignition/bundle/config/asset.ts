import ChainConfig from "webpack-chain";

export function configAsset(config: ChainConfig) {
  config.module
    .rule("image")
    .test(/\.(png|svg|jpg|jpeg|gif)$/i)
    .type("asset/resource" as any);

  config.module
    .rule("font")
    .test(/\.(woff|woff2|eot|ttf|otf)$/i)
    .type("asset/resource" as any);
}
