---

## id: deploy-cloudflare-pages
title: Deploy to Cloudflare Pages
status: active
stage: planning
type: ops
authority: deployment runbook for the Cloudflare Pages + Porkbun subdomain setup
last_updated: 2026-04-12
depends_on:
  - app/vite.config.ts
  - app/public/_redirects

# Deploy to Cloudflare Pages

Host the Vite build from `app/` on Cloudflare Pages with a custom subdomain via Porkbun DNS.

## Prerequisites

- A Porkbun account with an active domain
- A free Cloudflare account (no credit card required): [https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)

## 1. Create a Cloudflare Pages project

1. Log in to the Cloudflare dashboard at [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. In the left sidebar, go to **Workers & Pages**
3. Click **Create** then choose **Pages** and **Connect to Git**
4. Authorize Cloudflare to access your GitHub (or GitLab) account and select the `volley_drills` repository
5. Configure the build:
  - **Project name**: choose a name (e.g. `volley-drills`) -- this determines your default `*.pages.dev` URL
  - **Production branch**: `main`
  - **Root directory (path)**: `app` -- **this is critical**; without it Cloudflare looks for `package.json` at the repo root and the build fails immediately
  - **Build command**: `npm run build`
  - **Build output directory**: `dist`
6. Click **Save and Deploy**

Cloudflare will `cd` into `app/`, install dependencies, run the build, and publish `dist/`. The first deploy takes about a minute. When it finishes you get a live URL at `https://<project-name>.pages.dev`.

> **If you already created the project without setting Root directory**: go to the project **Settings > Builds & deployments** and set **Root directory (path)** to `app`, then trigger a new deploy.

> **Note on the peer dependency warning**: `vite-plugin-pwa` declares peer support for Vite 3-7 but works fine with Vite 8. Cloudflare's build will show a warning but succeed. If the build fails on dependency install, add the environment variable `NPM_FLAGS` with value `--legacy-peer-deps` in the Pages project settings under **Settings > Environment variables**.

## 2. Verify the default Pages URL

Before touching DNS, confirm the app works on the `*.pages.dev` URL:

- Open the home route (`/`)
- Navigate to `/safety`, `/run`, `/review` and refresh each to confirm SPA routing works (the `_redirects` file handles this)
- Open DevTools > Application > Service Workers and confirm the SW registers over HTTPS

## 3. Add your custom subdomain via Porkbun DNS

Suppose your domain is `example.com` and you want the app at `volley.example.com`.

1. In the Cloudflare Pages project, go to **Custom domains** (under the project settings)
2. Click **Set up a custom domain**
3. Enter `volley.example.com` and click **Continue**
4. Cloudflare will tell you to add a CNAME record. Note the target value -- it will be something like `<project-name>.pages.dev`

Now switch to Porkbun:

1. Log in to [https://porkbun.com](https://porkbun.com) and go to **Domain Management** for your domain
2. Open the **DNS Records** section
3. Add a new record:
  - **Type**: `CNAME`
  - **Host**: `volley` (just the subdomain part, not the full domain)
  - **Answer / Value**: `<project-name>.pages.dev` (the value Cloudflare gave you in step 4)
  - **TTL**: leave default or set to 600
4. Save the record

Back in the Cloudflare dashboard:

1. Click **Check DNS** or wait -- Cloudflare will detect the CNAME and provision a TLS certificate automatically
2. This can take anywhere from a few minutes to an hour. The status will change to **Active** when ready.

## 4. Validate the live deployment

Once the custom domain is active:

- `https://volley.example.com/` loads the home screen
- `https://volley.example.com/run` loads directly (not just via navigation) and survives a browser refresh
- `https://volley.example.com/safety` loads directly and survives refresh
- DevTools > Application > Service Workers shows the SW registered and active
- The browser address bar shows the lock icon (HTTPS working)
- On mobile: "Add to Home Screen" prompt or manual install works
- After installing to Home Screen: opening the app shows the standalone PWA experience
- After loading once, toggling airplane mode and reopening the app still works (offline via SW cache)
- On iPhone Safari specifically: confirm the app loads, storage persists across sessions when installed to Home Screen

## 5. Ongoing deploys

Every push to `main` triggers a new build and deploy automatically. Preview deploys are created for other branches and pull requests.

To trigger a manual redeploy without pushing code, go to the Pages project in Cloudflare and click **Retry deployment** on the latest deploy.

## Troubleshooting

**Build fails with "Could not read package.json" at `/opt/buildhome/repo/package.json`**: The Root directory is not set. Go to **Settings > Builds & deployments**, set **Root directory (path)** to `app`, and redeploy.

**Build fails on dependency install**: Add environment variable `NPM_FLAGS` = `--legacy-peer-deps` in Pages project settings.

**Deep links return 404**: Confirm `app/public/_redirects` contains `/* /index.html 200` and that `dist/_redirects` exists after build.

**HTTPS not working on custom domain**: DNS propagation can take up to an hour. Check that the CNAME record in Porkbun points to the correct `*.pages.dev` value. Cloudflare provisions TLS automatically once DNS resolves.

**Service worker not registering**: Service workers require HTTPS. The `*.pages.dev` URL and any custom domain with TLS provisioned will work. `http://` will not.