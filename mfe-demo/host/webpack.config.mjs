import HtmlWebpackPlugin from "html-webpack-plugin";
import ModuleFederationPlugin from "webpack/lib/container/ModuleFederationPlugin.js";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sharedReact } from "../shared/webpack-shared.mjs";
import { cssRule, devServer, mfeRoot, tsRule } from "../shared/webpack-utils.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProd = process.env.NODE_ENV === "production";
const remoteOrigin = process.env.MFE_REMOTE_ORIGIN ?? "http://localhost";

export default {
  context: __dirname,
  entry: "./src/index.tsx",
  mode: isProd ? "production" : "development",
  devServer: devServer(3100),
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
      name: "host",
      remotes: {
        auth: `auth@${remoteOrigin}:3101/remoteEntry.js`,
        navbar: `navbar@${remoteOrigin}:3102/remoteEntry.js`,
        sidebar: `sidebar@${remoteOrigin}:3103/remoteEntry.js`,
      },
      shared: {
        ...sharedReact,
        react: { ...sharedReact.react, eager: true },
        "react-dom": { ...sharedReact["react-dom"], eager: true },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Adolfo MFE Shell",
    }),
  ],
};
