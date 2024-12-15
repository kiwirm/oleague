// next.config.mjs

const nextConfig = {
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/app/admin/import": ["./node_modules/camaro/dist/*.wasm"],
  },

  webpack: (config, { isServer }) => {
    // it makes a WebAssembly modules async modules
    config.experiments = {
      syncWebAssembly: true,
      asyncWebAssembly: true,
      layers: true,
    };

    // generate wasm module in ".next/server" for ssr & ssg
    if (isServer) {
      config.output.webassemblyModuleFilename =
        "./../static/wasm/[modulehash].wasm";
    } else {
      config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
    }

    return config;
  },
};

export default nextConfig;
