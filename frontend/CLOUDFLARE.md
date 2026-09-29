# Cloudflare Pages — E-PETE storefront

Build settings (if connecting GitHub in Cloudflare dashboard):

- Framework preset: Vite
- Root directory: `frontend`
- Build command: `npm ci && npm run build`
- Build output directory: `dist`
- Environment variable:
  - `VITE_API_URL` = `https://epete-api.onrender.com/api` (update after Render URL is known)

Custom domain: attach `epete.in` / `www.epete.in` in Cloudflare Pages → Custom domains
(DNS for the zone is already on Cloudflare.)

CLI deploy (after `npx wrangler login`):

```bash
cd frontend
npm ci
$env:VITE_API_URL="https://epete-api.onrender.com/api"
npm run build
npx wrangler pages deploy dist --project-name=epete
```
