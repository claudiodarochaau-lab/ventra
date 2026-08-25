/**
 * Cloudflare Pages middleware: block internal repo files from being served.
 *
 * The repo root is the deploy root, so business documents (CLAUDE.md,
 * BRAND.md, pricing spreadsheets, agent skills) would otherwise be publicly
 * downloadable. Netlify staging is covered by _redirects; this covers
 * Cloudflare Pages, which doesn't support 404 statuses in _redirects.
 *
 * Longer term, moving the site into a /site output directory removes the
 * need for both. TODO [STRUCTURE]: consider that restructure post-launch.
 */

const BLOCKED_PREFIXES = [
  '/CLAUDE.md',
  '/BRAND.md',
  '/README.md',
  '/SHOTLIST.md',
  '/ICP.md',
  '/WEBSITE_UPDATE.md',
  '/linkedin-company-page-content.md',
  '/push-website-copy.sh',
  '/test-chat.html',
  '/website-copy/',
  '/weekly-briefs/',
  '/skills/',
  '/Products/',
  '/Brand/',
  '/assets/og/og-template.html',
  '/assets/og/generate.sh',
  '/assets/downloads/one-pager.html',
];

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);
  const blocked = BLOCKED_PREFIXES.some(
    (p) => pathname === p || (p.endsWith('/') && pathname.startsWith(p))
  );
  if (blocked) {
    const notFound = await context.env.ASSETS.fetch(
      new URL('/404.html', context.request.url)
    );
    return new Response(notFound.body, {
      status: 404,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  }
  return context.next();
}
