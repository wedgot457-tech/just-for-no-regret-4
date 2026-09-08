import { list } from '@vercel/blob';

export default async function handler(request, context) {
  if (request.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const slug = String(context?.params?.slug || '')
      .replace(/[^A-Za-z0-9]/g, '');
    if (!slug || slug.length < 5) {
      return Response.json({ error: 'Invalid link' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return Response.json({ error: 'Vercel Blob is not connected.' }, { status: 500 });
    }

    const result = await list({ prefix: `letters/config/${slug}.json`, limit: 1 });
    const item = result.blobs?.[0];
    if (!item) return Response.json({ error: 'Letter not found' }, { status: 404 });

    const response = await fetch(item.url, { cache: 'no-store' });
    if (!response.ok) return Response.json({ error: 'Letter not found' }, { status: 404 });

    const data = await response.json();
    return Response.json(data, {
      headers: {
        'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400'
      }
    });
  } catch (error) {
    console.error('Share load error:', error);
    return Response.json({ error: error?.message || 'Could not load this letter' }, { status: 500 });
  }
}
