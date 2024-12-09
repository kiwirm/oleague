// next.config.mjs

const nextConfig = {
  staticPageGenerationTimeout: 1000,
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  // outputFileTracingIncludes: {
  //   "/app/admin/import": ["./node_modules/camaro/dist/*.wasm"],
  // },

  // webpack(config, { isServer }) {
  //   config.experiments = {
  //     layers: true,
  //   };
  //   if (isServer) {
  //     config.output.webassemblyModuleFilename =
  //       "./../static/wasm/[modulehash].wasm";
  //   } else {
  //     config.output.webassemblyModuleFilename = "static/wasm/[modulehash].wasm";
  //   }
  //   config.experiments = { asyncWebAssembly: true };
  //   config.optimization.moduleIds = "named";

  //   return config;
  // },
};

export default nextConfig;
