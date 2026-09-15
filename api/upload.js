import { put, issueSignedToken, presignUrl } from '@vercel/blob';
import { Readable } from 'node:stream';

const MAX_IMAGE = 25 * 1024 * 1024;
const MAX_VIDEO = 1024 * 1024 * 1024;
const SERVER_LIMIT = 4 * 1024 * 1024;
const SAFE_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif',
  'video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'
];

function safeName(name = 'upload') {
  return String(name).replace(/[^a-zA-Z0-9._-]/g, '-').slice(-100) || 'upload';
}
function isAllowed(contentType) { return SAFE_TYPES.includes(contentType); }
function limitFor(kind, contentType) {
  return (kind === 'background-video' || contentType.startsWith('video/')) ? MAX_VIDEO : MAX_IMAGE;
}

export default async function handler(request, response) {
  try {
    if (request.method === 'POST') {
      // Prepare a direct upload for files larger than the serverless payload limit.
      const body = request.body || {};
      const filename = safeName(body.filename || 'upload');
      const contentType = String(body.contentType || 'application/octet-stream').toLowerCase();
      const size = Number(body.size || 0);
      const kind = String(body.kind || 'media');
      if (!Number.isFinite(size) || size < 1) return response.status(400).json({ error: 'Missing file size.' });
      if (!isAllowed(contentType)) return response.status(415).json({ error: 'Unsupported file type.' });
      if (size > limitFor(kind, contentType)) return response.status(413).json({ error: `File is too large. Maximum is ${contentType.startsWith('video/') ? '1 GB' : '25 MB'}.` });

      const pathname = `letters/media/${crypto.randomUUID()}-${filename}`;
      const validUntil = Date.now() + 30 * 60 * 1000;
      const token = await issueSignedToken({ pathname, operations: ['put'], validUntil });
      const { presignedUrl } = await presignUrl(token, { pathname, operation: 'put', validUntil });
      return response.status(200).json({ ok: true, mode: 'direct', uploadUrl: presignedUrl, url: String(presignedUrl).split('?')[0], pathname });
    }

    if (request.method === 'PUT') {
      // Small files use a normal Vercel Function upload. This avoids browser CORS
      // issues with direct PUTs while staying below Vercel's 4.5 MB function limit.
      const contentType = String(request.headers['content-type'] || '').toLowerCase();
      const size = Number(request.headers['content-length'] || 0);
      const kind = String(request.headers['x-upload-kind'] || 'media');
      const filename = safeName(request.headers['x-upload-name'] || 'upload');
      if (!size || size > SERVER_LIMIT) return response.status(413).json({ error: 'This upload is too large for the server path. Use the direct upload path.' });
      if (!isAllowed(contentType)) return response.status(415).json({ error: 'Unsupported file type.' });
      if (size > limitFor(kind, contentType)) return response.status(413).json({ error: 'File is too large.' });

      const body = Readable.toWeb(request);
      const blob = await put(`letters/media/${crypto.randomUUID()}-${filename}`, body, {
        access: 'public',
        addRandomSuffix: false,
        contentType,
        cacheControlMaxAge: 31536000,
      });
      return response.status(200).json({ ok: true, mode: 'server', url: blob.url, pathname: blob.pathname, contentType: blob.contentType });
    }

    return response.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Blob upload error:', error);
    return response.status(500).json({ error: error?.message || 'Could not upload file.' });
  }
}
