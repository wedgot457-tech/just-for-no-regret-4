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
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // This endpoint only exchanges a tiny JSON request for a short-lived,
    // single-file Blob PUT URL. The actual media never enters the Vercel Function.
    const body = request.body || {};
    const filename = safeName(body.filename || 'upload');
    const contentType = String(body.contentType || 'application/octet-stream');
    const size = Number(body.size || 0);
    const kind = String(body.kind || 'media');

    if (!size || size < 1) {
      return response.status(400).json({ error: 'Missing file size.' });
    }

    if (!SAFE_TYPES.includes(contentType)) {
      return response.status(415).json({ error: 'Unsupported file type.' });
    }

    const isVideo = kind === 'background-video' || contentType.startsWith('video/');
    const maxSize = isVideo ? MAX_VIDEO : MAX_IMAGE;

    if (size > maxSize) {
      return response.status(413).json({
        error: `File is too large. Maximum is ${isVideo ? '1 GB' : '25 MB'}.`
      });
    }

    const pathname = `letters/media/${crypto.randomUUID()}-${filename}`;
    const validUntil = Date.now() + 15 * 60 * 1000;

    const token = await issueSignedToken({
      pathname,
      operations: ['put'],
      allowedContentTypes: [contentType],
      maximumSizeInBytes: maxSize,
      validUntil
    });

    const { presignedUrl } = await presignUrl(token, {
      pathname,
      operation: 'put',
      validUntil
    });

    // The public URL is deterministic for the returned pathname, but obtaining it
    // from the presigned URL keeps this endpoint independent of store IDs.
    const publicUrl = presignedUrl.split('?')[0];

    return response.status(200).json({
      ok: true,
      uploadUrl: presignedUrl,
      url: publicUrl,
      pathname,
      contentType,
      expiresAt: validUntil
    });
  } catch (error) {
    console.error('Blob upload URL error:', error);
    return response.status(500).json({
      error: error?.message || 'Could not prepare the direct Blob upload.'
    });
  }
}
