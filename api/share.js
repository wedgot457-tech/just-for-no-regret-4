import { put, list } from '@vercel/blob';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function makeSlug(length = 5) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
}

function cleanSlug(value) {
  const slug = String(value || '').replace(/[^A-Za-z0-9]/g, '');
  return slug.length >= 4 ? slug : '';
}

async function loadConfig(slug) {
  const result = await list({
    prefix: `letters/config/${slug}.json`,
    limit: 1,
  });
  const item = result.blobs?.[0];
  if (!item) return null;

  const saved = await fetch(item.url, { cache: 'no-store' });
  if (!saved.ok) return null;
  return saved.json();
}

export default async function handler(request, response) {
  // GET is intentionally supported here as well as /api/share/[slug].js.
  // This gives the viewer a simple fallback route if a Vercel dynamic API
  // rewrite behaves differently in a particular deployment.
  if (request.method === 'GET') {
    try {
      const slug = cleanSlug(request.query?.slug);
      if (!slug) return response.status(400).json({ error: 'Invalid share link.' });

      const data = await loadConfig(slug);
      if (!data) return response.status(404).json({ error: 'Letter not found.' });

      response.setHeader('cache-control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
      return response.status(200).json(data);
    } catch (error) {
      console.error('Share load error:', error);
      return response.status(500).json({ error: error?.message || 'Could not load this letter.' });
    }
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const config = request.body?.config;
    if (!config || typeof config !== 'object') {
      return response.status(400).json({ error: 'Missing configuration' });
    }

    let blob = null;
    let slug = '';
    let lastError = null;

    for (let attempt = 0; attempt < 8 && !blob; attempt += 1) {
      slug = makeSlug();
      try {
        blob = await put(
          `letters/config/${slug}.json`,
          JSON.stringify({
            version: 5,
            createdAt: new Date().toISOString(),
            config,
          }),
          {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'application/json',
            cacheControlMaxAge: 31536000,
          }
        );
      } catch (error) {
        lastError = error;
      }
    }

    if (!blob) throw lastError || new Error('Could not save the letter to Vercel Blob.');

    const proto = request.headers['x-forwarded-proto'] || 'https';
    const host = request.headers['x-forwarded-host'] || request.headers.host;
    if (!host) throw new Error('Could not determine the share URL host.');
    const origin = `${proto}://${host}`;

    return response.status(200).json({
      ok: true,
      slug,
      url: `${origin}/s/${slug}`,
      blobUrl: blob.url,
    });
  } catch (error) {
    console.error('Share creation error:', error);
    return response.status(500).json({
      error: error?.message || 'Could not create the share link.',
    });
  }
}
