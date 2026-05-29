# Deployment Guide

This project is a Vite + React app. Below are quick instructions for preview and deploying to Netlify or Vercel.

Local preview

```bash
npm install
npm run dev
# open http://localhost:4173/
```

Build for production

```bash
npm run build
# `dist/` will contain static assets
```

Netlify

1. Connect your Git repository in Netlify.
2. Set build command to `npm run build` and publish directory to `dist`.
3. Ensure the `public/_redirects` file exists (it is included in this repo) to support SPA routing.
4. (Optional) Add environment variables like `SUPABASE_URL` and `SUPABASE_KEY` in Netlify site settings if using Supabase features.

Vercel

1. Import the project in Vercel and select "Other" or static build settings.
2. Use `npm run build` as the build command and `dist` as the output directory.
3. Add environment variables in Vercel's dashboard as needed.

Custom domain on GitHub Pages

- A `public/CNAME` file has been added with `jokkywhiteediting.com`.
- When the site is deployed, GitHub Pages will publish that domain automatically.
- Make sure your DNS provider points `jokkywhiteediting.com` to GitHub Pages.

Notes

- The app expects client-side routing; Netlify/Vercel configs above support SPA fallback to `index.html`.
- If you use Supabase or other external services, add their keys as environment variables.
