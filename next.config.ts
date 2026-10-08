import type { NextConfig } from "next"
import { withBotId } from "botid/next/config"

const nextConfig: NextConfig = {
  images: {
    loader: "custom",
    loaderFile: "./lib/image-loader.ts",
  },
}

export default withBotId(nextConfig)
