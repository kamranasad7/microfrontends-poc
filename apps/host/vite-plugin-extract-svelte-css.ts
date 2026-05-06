import type { Plugin, ViteDevServer } from 'vite';

/**
 * Dev-mode FOUC fix for Svelte components served via `?svelte&type=style&lang.css?direct`.
 *
 * vite-plugin-svelte serves Svelte component styles wrapped in a JS HMR injector.
 * vike-svelte adds those URLs as `<link rel="stylesheet">` in the SSR HTML head,
 * but browsers can't apply them because the response body is JS, not CSS — so the
 * page renders unstyled until the page's main JS bundle executes the HMR injector.
 *
 * This middleware intercepts those URLs, extracts the `__vite__css = "..."` string
 * from the HMR wrapper, and serves it as actual CSS. Browsers then apply it like
 * a normal stylesheet, eliminating the dev-mode flash of unstyled content.
 *
 * Production builds don't need this — Vite extracts CSS to real files at build time.
 */
export function extractSvelteCss(): Plugin {
  let server: ViteDevServer;

  return {
    name: 'extract-svelte-css',
    apply: 'serve',
    configureServer(devServer) {
      server = devServer;
      devServer.middlewares.use(async (req, res, next) => {
        const url = (req as { url?: string }).url;
        if (!url) return next();
        // Only intercept the `?direct` variant — these are what vike-svelte
        // puts into <link rel="stylesheet"> tags. The non-direct URLs are
        // imported as JS modules by the page bundle and must stay as JS.
        if (!url.includes('.svelte') || !url.includes('type=style') || !url.includes('lang.css')) {
          return next();
        }
        if (!url.endsWith('?direct') && !url.endsWith('&direct')) {
          return next();
        }
        // Strip `?direct` to get the JS HMR wrapper containing __vite__css
        const sourceUrl = url.replace(/\?direct$/, '').replace(/&direct$/, '');

        try {
          const result = await server.transformRequest(sourceUrl);
          if (!result || !result.code) return next();

          // Extract CSS from the HMR wrapper: const __vite__css = "..."
          const match = result.code.match(/const __vite__css\s*=\s*("(?:[^"\\]|\\.)*")/);
          if (!match) return next();

          // Parse the JS string literal to get raw CSS
          const css = JSON.parse(match[1]);

          res.setHeader('Content-Type', 'text/css');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(css);
        } catch {
          next();
        }
      });
    },
  };
}
