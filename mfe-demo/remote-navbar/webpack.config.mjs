import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sharedReact } from "../shared/webpack-shared.mjs";
import { cssRule, devServer, mfeRoot, tsRule } from "../shared/webpack-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  context: __dirname,
  entry: "./src/index.tsx",
  mode: "development",
  devServer: devServer(3102),
  output: {
    publicPath: "auto",
    clean: true,
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      "@shared": path.join(mfeRoot, "shared"),
    },
  },
  module: {
    rules: [tsRule(), cssRule()],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "navbar",
      filename: "remoteEntry.js",
      exposes: {
        "./Navbar": "./src/Navbar",
      },
      shared: sharedReact,
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "MFE — Navbar remote",
    }),
  ],
};
