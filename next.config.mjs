const defaultImageRemotePatterns = [
  {
    protocol: "https",
    hostname: "edenartlab-prod-data.s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "eden-creations-prod.s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "edenartlab-prod-data.s3.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "edenartlab-prod-data.s3-accelerate.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "edenartlab-stage-data.s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "eden-creations-stg.s3.us-east-1.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "edenartlab-stage-data.s3.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "edenartlab-stage-data.s3-accelerate.amazonaws.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "minio.aws.abraham.fun",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "dtut5r9j4w7j4.cloudfront.net",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "d14i3advvh2bvd.cloudfront.net",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "files.stripe.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "cdn.discordapp.com",
    port: "",
    pathname: "**",
  },
  {
    protocol: "https",
    hostname: "res.cloudinary.com",
    port: "",
    pathname: "**",
  },
];

const devImageRemotePatterns = [
  {
    protocol: "http",
    hostname: "localhost",
    port: "",
    pathname: "**",
  },
];

const imageRemotePatterns =
  process.env.NODE_ENV === "development"
    ? [...defaultImageRemotePatterns, ...devImageRemotePatterns]
    : defaultImageRemotePatterns;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: false,
  images: {
    minimumCacheTTL: 2433600,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560],
    remotePatterns: imageRemotePatterns,
  },
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 180,
    },
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
};

// Injected content via Sentry wizard below
if (process.env.NODE_ENV !== "development") {
  const { withSentryConfig } = await import("@sentry/nextjs");
  Object.assign(
    nextConfig,
    withSentryConfig(nextConfig, {
      org: "edenlabs",
      project: "eden2-frontend",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      reactComponentAnnotation: {
        enabled: true,
      },
      tunnelRoute: "/monitoring",
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: false,
    })
  );
}

export default {
  ...nextConfig,
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "app2.eden.art",
          },
        ],
        destination: "https://beta.eden.art/:path*",
        permanent: true,
        basePath: false,
      },
    ];
  },
};
