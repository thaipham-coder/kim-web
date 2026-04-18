import type { NextConfig } from "next";
import createMDX from '@next/mdx'
import withSerwist from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  experimental: {
    mdxRs: true,
  },
  reactCompiler: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  extension: /\.(md|mdx)$/,
})

const withPWA = withSerwist({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

// Merge MDX config with Next.js config, then wrap with Serwist
export default withPWA(withMDX(nextConfig))

