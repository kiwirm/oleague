module.exports ={
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true,
  },
    webpack: (config: any, context: any) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
  outputFileTracingIncludes: {
    "/app/admin/import": ["./node_modules/camaro/dist/camaro.wasm"],
  },
};