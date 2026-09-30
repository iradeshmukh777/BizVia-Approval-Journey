---
name: Standalone npm deployment builds
description: Avoid cross-contamination between npm deployment builds and pnpm-managed artifact dependencies.
---

When preparing a standalone npm deployment inside this pnpm monorepo, do not generate a lockfile while npm can see the existing pnpm-linked package-local `node_modules`. npm may run prepare scripts against those links or produce a lockfile that omits packages. Generate the lockfile in a clean package tree and verify it with a fresh install and production build.

**Why:** The shared Replit workspace dependency layout is not equivalent to a clean npm install, and a superficially successful lockfile-only operation can be incomplete.

**How to apply:** For Vercel or Netlify configuration on a workspace subpackage, test `npm install`/`npm ci` and the build in an isolated copy before trusting the deployment config.