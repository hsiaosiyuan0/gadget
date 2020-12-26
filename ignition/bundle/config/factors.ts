export type Mode = "development" | "production";

export interface ConfigFactors {
  mode: Mode;

  project: string;
  pagesDir: string;

  outputPath: string;
  publicPath: string;

  browserslist?: string[];
}
