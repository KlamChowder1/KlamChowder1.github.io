# Kevin Lam - Profile Timeline

A simple, high-contrast experience timeline powered by React and Vite. Cards expand on click so you can skim roles quickly and open them for deeper highlights.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the local dev server:
   ```bash
   npm run dev
   ```
   Vite opens the site at http://localhost:5173 by default.

## Editing your experience

- Update the entries in `src/data/experience.ts` to match the roles, periods, and highlights from your resume.
- Adjust the intro copy inside `src/App.tsx` as needed.
- Replace `public/favicon.svg` or tweak the visual styling in `src/App.css`/`src/styles.css` to better fit your brand.

## Production build

Create an optimized build in `dist/` with:
```bash
npm run build
```

Preview the production output locally with:
```bash
npm run preview
```

Deploy the contents of the generated `dist/` directory to your preferred hosting provider (Vercel, Netlify, GitHub Pages, etc.).
