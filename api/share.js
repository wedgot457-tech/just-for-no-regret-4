import { put } from '@vercel/blob';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function makeSlug(length = 5) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes].map((b) => alphabet[b % alphabet.length]).join('');
}

export default async function handler(request, response) {
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

    for (let attempt = 0; attempt < 5 && !blob; attempt += 1) {
      slug = makeSlug();
      try {
        blob = await put(
          `letters/config/${slug}.json`,
          JSON.stringify({
            version: 4,
            createdAt: new Date().toISOString(),
            config
          }),
          {
            access: 'public',
            addRandomSuffix: false,
            contentType: 'application/json',
            cacheControlMaxAge: 31536000
          }
        );
      } catch (error) {
        lastError = error;
      }
    }

    if (!blob) {
      throw lastError || new Error('Could not save the letter to Vercel Blob.');
    }

    const origin = `https://${request.headers.host}`;

    return response.status(200).json({
      ok: true,
      slug,
      url: `${origin}/s/${slug}`,
      blobUrl: blob.url
    });
  } catch (error) {
    console.error('Share creation error:', error);
    return response.status(500).json({
      error: error?.message || 'Could not create the share link.'
    });
  }
}
