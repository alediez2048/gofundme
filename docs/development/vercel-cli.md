# Vercel CLI — Link & Deploy from Terminal

The project is set up for Vercel with a **vercel.json** (Next.js, `npm run build`, `npm install`). Do the link and first deploy from your own terminal so the CLI can use your login.

## One-time: link this repo to your Vercel project

From the project root:

```bash
npm run vercel:link
```

If the project **gofundme** doesn’t exist yet, the CLI will create it. If it already exists (e.g. from the dashboard), it will link to it. Log in in the browser if prompted.

## Deploy

- **Preview (every branch):**  
  `npm run vercel:deploy`  
  or:  
  `npx vercel`

- **Production:**  
  `npm run vercel:prod`  
  or:  
  `npx vercel --prod`

After linking once, pushing to GitHub will still trigger deploys from the Vercel dashboard (if the project is connected to the repo). The CLI is for on-demand deploys and linking.
