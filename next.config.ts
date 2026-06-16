import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Tetapkan root proyek agar tidak salah deteksi lockfile di folder atas
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
