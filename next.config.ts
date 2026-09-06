import type { NextConfig } from "next";

const repositoryName = "RadarParadesporto";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isProduction ? `/${repositoryName}` : "",
  env: {
    NEXT_PUBLIC_BASE_PATH: isProduction ? `/${repositoryName}` : "",
  },
};

export default nextConfig;
