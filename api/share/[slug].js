import { list } from '@vercel/blob';

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const rawSlug = request.query?.slug || '';
    const slug = String(rawSlug).replace(/[^A-Za-z0-9]/g, '');

    if (!slug || slug.length < 5) {
      return response.status(400).json({ error: 'Invalid share link.' });
    }

    const result = await list({
      prefix: `letters/config/${slug}.json`,
      limit: 1
    });

    const item = result.blobs?.[0];
    if (!item) {
      return response.status(404).json({ error: 'Letter not found.' });
    }

    const saved = await fetch(item.url, { cache: 'no-store' });
    if (!saved.ok) {
      return response.status(404).json({ error: 'Letter not found.' });
    }

    const data = await saved.json();
    response.setHeader('cache-control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=86400');
    return response.status(200).json(data);
  } catch (error) {
    console.error('Share load error:', error);
    return response.status(500).json({
      error: error?.message || 'Could not load this letter.'
    });
  }
}
