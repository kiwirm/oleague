// next.config.mjs

const nextConfig = {
  staticPageGenerationTimeout: 1000,
  typescript: {
    ignoreBuildErrors: true,
  },
  outputFileTracingIncludes: {
    "/app/admin/import": ["./node_modules/camaro/dist/camaro.wasm"],
  },
};

export default nextConfig;
