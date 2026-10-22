import { defineConfig } from 'astro/config';

/**
 * Public origin of the site, used for canonical / Open Graph URLs, sitemap.xml and robots.txt.
 *
 * Resolution order:
 *   1. SITE_URL                        – set this once the final domain is known
 *   2. VERCEL_PROJECT_PRODUCTION_URL   – provided by Vercel (the project's production domain)
 *   3. VERCEL_URL                      – provided by Vercel (the current deployment)
 *   4. http://localhost:4321           – local development
 */
function resolveSite() {
  const explicit = process.env.SITE_URL?.trim();
  if (explicit) return explicit.startsWith('http') ? explicit : `https://${explicit}`;
  const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  return vercelHost ? `https://${vercelHost}` : 'http://localhost:4321';
}

export default defineConfig({
  site: resolveSite(),
  // `true` removes whitespace losslessly; Astro 7's default ('jsx') would drop the space between adjacent inline elements.
  compressHTML: true,
  build: {
    // The whole stylesheet is ~15 KB: inlining it removes a render-blocking request from the critical path.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // The glass panels use `backdrop-filter`; iOS/Safari before 18 needs the -webkit- prefix, which the CSS
      // toolchain only adds when those browsers are targeted. Write the prefixed declaration *before* the
      // standard one in the source (as in the *.module.css files) and let the build emit what is needed.
      cssTarget: ['chrome107', 'firefox104', 'safari16'],
    },
  },
});
