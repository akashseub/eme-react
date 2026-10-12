// Cloudflare Pages Function: same-origin proxy for the Express API.
// Configure API_ORIGIN in Cloudflare Pages Variables and Secrets,
// e.g. https://eme-inspection-api.onrender.com (no trailing slash).
export async function onRequest({ request, env }) {
  const base = env.API_ORIGIN;
  if (!base) {
    return new Response('API proxy is not configured', { status: 503 });
  }

  let origin;
  try {
    origin = new URL(base);
    if (origin.protocol !== 'https:' || origin.username || origin.password ||
        origin.pathname !== '/' || origin.search || origin.hash) {
      throw new Error('Invalid API_ORIGIN');
    }
  } catch {
    return new Response('Invalid API proxy configuration', { status: 503 });
  }

  const incoming = new URL(request.url);
  const upstream = new URL(incoming.pathname + incoming.search, origin);
  // Pass the original Origin and Cookie headers through so Express can
  // enforce its CSRF-origin check and read its HTTP-only session cookie.
  return fetch(new Request(upstream, request), { redirect: 'manual' });
}
