// next.config.mjs

const nextConfig = {
  experimental: {
    turbotrace
  },
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true,
  },
    webpack: (config, context) => {
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

export default nextConfig;
