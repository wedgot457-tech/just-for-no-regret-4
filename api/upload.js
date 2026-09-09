import Busboy from 'busboy';
import { put } from '@vercel/blob';

export const config = { api: { bodyParser: false } };

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = request.headers['content-type'] || '';
    if (!contentType.toLowerCase().includes('multipart/form-data')) {
      return response.status(400).json({ error: 'Expected multipart/form-data upload.' });
    }

    const fields = {};
    const chunks = [];
    let fileInfo = null;

    await new Promise((resolve, reject) => {
      const bb = Busboy({ headers: request.headers });

      bb.on('field', (name, value) => {
        fields[name] = value;
      });

      bb.on('file', (name, file, info) => {
        if (name !== 'file') {
          file.resume();
          return;
        }

        fileInfo = info;
        file.on('data', (chunk) => chunks.push(chunk));
        file.on('error', reject);
      });

      bb.on('error', reject);
      bb.on('finish', resolve);
      request.on('error', reject);
      request.pipe(bb);
    });

    if (!fileInfo || !chunks.length) {
      return response.status(400).json({ error: 'No file supplied.' });
    }

    const buffer = Buffer.concat(chunks);
    const kind = String(fields.kind || 'media');
    const maxBytes = kind === 'background-video' ? 4 * 1024 * 1024 : 3 * 1024 * 1024;

    if (buffer.length > maxBytes) {
      return response.status(413).json({
        error: `File is too large. Maximum is ${Math.round(maxBytes / 1024 / 1024)} MB.`
      });
    }

    const safeName = String(fileInfo.filename || 'upload')
      .replace(/[^a-zA-Z0-9._-]/g, '-')
      .slice(-80) || 'upload';

    const blob = await put(
      `letters/media/${crypto.randomUUID()}-${safeName}`,
      buffer,
      {
        access: 'public',
        addRandomSuffix: false,
        contentType: fileInfo.mimeType || 'application/octet-stream',
        cacheControlMaxAge: 31536000
      }
    );

    return response.status(200).json({
      url: blob.url,
      pathname: blob.pathname,
      contentType: blob.contentType
    });
  } catch (error) {
    console.error('Upload error:', error);
    return response.status(500).json({
      error: error?.message || 'Upload failed. Check that Vercel Blob is connected.'
    });
  }
}
