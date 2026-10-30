import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { execSync } from "node:child_process";

const nextConfig: NextConfig = {
  /* config options here */
};

export default function config(phase: string): NextConfig {
  // Every production build (local or Vercel) runs the math checks first; a failure stops the build.
  if (phase === PHASE_PRODUCTION_BUILD && !process.env.SLB_MATH_CHECKS_DONE) {
    execSync("npx vitest run", { stdio: "inherit" });
    process.env.SLB_MATH_CHECKS_DONE = "1";
  }
  return nextConfig;
}
