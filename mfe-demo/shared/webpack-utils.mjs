import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const mfeRoot = path.resolve(__dirname, "..");

export function srcPath(appDir, segment) {
  return path.resolve(appDir, "src", segment);
}

export function cssRule() {
  return {
    test: /\.css$/i,
    use: ["style-loader", "css-loader"],
  };
}

export function tsRule() {
  return {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/,
    options: {
      configFile: path.join(mfeRoot, "tsconfig.json"),
      transpileOnly: true,
    },
  };
}

export function devServer(port) {
  return {
    port,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  };
}
