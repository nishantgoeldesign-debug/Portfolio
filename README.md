# Portfolio

Personal portfolio site — React + Vite, with a TinaCMS content layer.

## Run locally

```bash
npm install        # once, after cloning
npm run dev        # preview the site at http://localhost:5173
```

## Edit content (CMS)

```bash
npm run cms        # then open http://localhost:5173/admin/index.html
```

Content lives in `content/` (`home.json` + `case-studies/*.json`). Images are in
`public/assets`. Saving in the CMS writes to those files — commit and push to
publish. TinaCMS runs in free local mode; no account required.

## Deploy (Vercel)

`vercel.json` is preconfigured:

- Build command: `vite build`
- Output directory: `dist/client`

Import the repo on Vercel and it deploys as-is. (The `npm run build` script also
runs an OpenAI-Sites step that Vercel doesn't need — `vercel.json` bypasses it.)
