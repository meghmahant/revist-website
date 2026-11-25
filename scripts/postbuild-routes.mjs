import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const indexPath = resolve(distDir, 'index.html');

if (!existsSync(indexPath)) {
  throw new Error('dist/index.html not found; build must run before postbuild-routes.');
}

const baseHtml = readFileSync(indexPath, 'utf8');

const staticRoutes = [
  {
    dir: 'privacy-policy',
    title: 'Privacy Policy (Draft) | Revist',
    description:
      'Draft Privacy Policy describing website trial request lead handling and data minimization principles for Revist.',
    canonical: 'https://therevist.in/privacy-policy/',
  },
  {
    dir: 'terms-of-service',
    title: 'Terms of Service (Draft) | Revist',
    description:
      'Draft Terms of Service for the Revist marketing website, trial requests, and illustrative demonstrations.',
    canonical: 'https://therevist.in/terms-of-service/',
  },
];

for (const route of staticRoutes) {
  const outDir = resolve(distDir, route.dir);
  mkdirSync(outDir, { recursive: true });
  const html = baseHtml
    .replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\s*\/?>/,
      `<meta name="description" content="${route.description}" />`,
    )
    .replace(
      /<link rel="canonical" href="[^"]*"\s*\/?>/,
      `<link rel="canonical" href="${route.canonical}" />`,
    );
  writeFileSync(resolve(outDir, 'index.html'), html, 'utf8');
}

// GitHub Pages SPA fallback for deep links without trailing slash
copyFileSync(indexPath, resolve(distDir, '404.html'));
console.log('Generated static GitHub Pages routes: /privacy-policy/, /terms-of-service/, and 404.html');
