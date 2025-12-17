import { reactRouter } from "@react-router/dev/vite";
import { execSync } from "node:child_process";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths()],
  base: "/",
  define: {
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
});
