import { put } from '@vercel/blob';

const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';

function makeSlug(length = 7) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return [...bytes]
    .map((b) => alphabet[b % alphabet.length])
    .join('');
}

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    // Vercel Node-style functions provide the parsed body here.
    const body = request.body;
    const config = body?.config;

    if (!config || typeof config !== 'object') {
      return response.status(400).json({
        error: 'Missing configuration'
      });
    }

    const slug = makeSlug();

    const blob = await put(
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

    const origin = new URL(request.url, `https://${request.headers.host}`).origin;

    return response.status(200).json({
      slug,
      url: `${origin}/s/${slug}`,
      blobUrl: blob.url
    });

  } catch (error) {
    console.error('Share creation error:', error);

    return response.status(500).json({
      error: error?.message || 'Could not create the share link'
    });
  }
}
