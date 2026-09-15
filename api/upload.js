import { issueSignedToken, presignUrl } from '@vercel/blob';

const MAX_IMAGE = 25 * 1024 * 1024;
const MAX_VIDEO = 1024 * 1024 * 1024;
const SAFE_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

function safeName(name = 'upload') {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'upload';
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  try {
    const body = request.body || {};
    const filename = safeName(body.filename || 'upload');
    const contentType = String(body.contentType || 'application/octet-stream').toLowerCase();
    const size = Number(body.size || 0);
    const kind = String(body.kind || 'media');

    if (!Number.isFinite(size) || size < 1) return response.status(400).json({ error: 'Missing file size.' });
    if (!SAFE_TYPES.includes(contentType)) return response.status(415).json({ error: 'Unsupported file type.' });

    const isVideo = kind === 'background-video' || contentType.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO : MAX_IMAGE;
    if (size > maxSize) return response.status(413).json({ error: `File is too large. Maximum is ${isVideo ? '1 GB' : '25 MB'}.` });

    const pathname = `letters/media/${crypto.randomUUID()}-${filename}`;
    const validUntil = Date.now() + 15 * 60 * 1000;

    // Signed PUT: browser -> Blob directly. The function never receives the file.
    const token = await issueSignedToken({
      pathname,
      operations: ['put'],
      validUntil,
    });
    const { presignedUrl } = await presignUrl(token, {
      pathname,
      operation: 'put',
      validUntil,
    });

    // A public Blob URL has the same origin/path as the signed URL, minus the query string.
    const publicUrl = String(presignedUrl).split('?')[0];
    return response.status(200).json({ ok: true, uploadUrl: presignedUrl, url: publicUrl, pathname, contentType, expiresAt: validUntil });
  } catch (error) {
    console.error('Blob upload URL error:', error);
    return response.status(500).json({ error: error?.message || 'Could not prepare the direct Blob upload.' });
  }
}
