// next.config.mjs
import CopyPlugin from "copy-webpack-plugin";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, { isServer }) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle WebAssembly files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    // Add copy plugin to ensure WASM file is copied
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: path.join(__dirname, "node_modules/camaro/dist/camaro.wasm"),
            to: path.join(
              __dirname,
              isServer ? ".next/server/vendor-chunks" : ".next/static/chunks"
            ),
          },
        ],
      })
    );

    // Set the correct path for WebAssembly modules
    if (isServer) {
      config.output.webassemblyModuleFilename = "./chunks/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename =
        "static/chunks/[modulehash].wasm";
    }

    return config;
  },
};

export default nextConfig;
