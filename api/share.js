import { put } from '@vercel/blob';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
function makeSlug(length = 7) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
}

export default async function handler(request) {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({
        error: 'Vercel Blob is not connected. Open your Vercel project → Storage → Blob and connect a store, then redeploy.'
      }, { status: 500 });
    }

    const body = await request.json();
    const config = body?.config;
    if (!config || typeof config !== 'object') {
      return Response.json({ error: 'Missing configuration' }, { status: 400 });
    }

    let slug;
    let blob;
    let lastError;
    for (let attempt = 0; attempt < 5; attempt++) {
      slug = makeSlug();
      try {
        blob = await put(`letters/config/${slug}.json`, JSON.stringify({
          version: 3,
          createdAt: new Date().toISOString(),
          config
        }), {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'application/json',
          cacheControlMaxAge: 31536000
        });
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (!blob) throw lastError || new Error('Blob upload failed');

    const origin = new URL(request.url).origin;
    return Response.json({
      ok: true,
      slug,
      url: `${origin}/s/${slug}`,
      blobUrl: blob.url
    }, { status: 200, headers: { 'cache-control': 'no-store' } });
  } catch (error) {
    console.error('Share creation error:', error);
    return Response.json({
      error: error?.message || 'Could not create the share link. Check that Vercel Blob is connected.'
    }, { status: 500 });
  }
}
