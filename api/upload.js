import { put } from '@vercel/blob';

export const config = { api: { bodyParser: false } };

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'content-type': 'application/json' }
    });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const kind = String(form.get('kind') || 'media');

    if (!(file instanceof File)) {
      return Response.json({ error: 'No file supplied' }, { status: 400 });
    }

    const maxBytes = kind === 'background-video' ? 4 * 1024 * 1024 : 3 * 1024 * 1024;
    if (file.size > maxBytes) {
      return Response.json({
        error: `File is too large. Maximum is ${Math.round(maxBytes / 1024 / 1024)} MB.`
      }, { status: 413 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-80) || 'upload';
    const blob = await put(`letters/media/${crypto.randomUUID()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type || 'application/octet-stream',
      cacheControlMaxAge: 31536000
    });

    return Response.json({ url: blob.url, pathname: blob.pathname, contentType: blob.contentType });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Upload failed. Make sure a Vercel Blob store is connected.' }, { status: 500 });
  }
}
