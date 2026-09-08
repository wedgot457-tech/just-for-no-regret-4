import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({
      error: 'Method not allowed'
    });
  }

  try {
    // IMPORTANT:
    // This endpoint receives multipart/form-data.
    // The old request.formData() approach does not work
    // with this Vercel Node-style function.

    const contentType = request.headers['content-type'] || '';

    if (!contentType.includes('multipart/form-data')) {
      return response.status(400).json({
        error: 'Expected multipart/form-data upload'
      });
    }

    // This version needs a multipart parser because
    // Vercel's Node-style request does not provide request.formData().
    const Busboy = (await import('busboy')).default;

    const bb = Busboy({
      headers: request.headers
    });

    let fileBuffer = null;
    let fileName = 'upload';
    let fileType = 'application/octet-stream';
    let kind = 'media';

    bb.on('field', (name, value) => {
      if (name === 'kind') {
        kind = String(value || 'media');
      }
    });

    bb.on('file', (name, file, info) => {
      fileName = info.filename || 'upload';
      fileType = info.mimeType || 'application/octet-stream';

      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    bb.on('error', (error) => {
      throw error;
    });

    await new Promise((resolve, reject) => {
      bb.on('finish', resolve);
      bb.on('error', reject);
      request.on('error', reject);
      request.pipe(bb);
    });

    if (!fileBuffer) {
      return response.status(400).json({
        error: 'No file supplied'
      });
    }

    const maxBytes =
      kind === 'background-video'
        ? 4 * 1024 * 1024
        : 3 * 1024 * 1024;

    if (fileBuffer.length > maxBytes) {
      return response.status(413).json({
        error:
          `File is too large. Maximum is ` +
          `${Math.round(maxBytes / 1024 / 1024)} MB.`
      });
    }

    const safeName =
      fileName
        .replace(/[^a-zA-Z0-9._-]/g, '-')
        .slice(-80) || 'upload';

    const blob = await put(
      `letters/media/${crypto.randomUUID()}-${safeName}`,
      fileBuffer,
      {
        access: 'public',
        addRandomSuffix: false,
        contentType: fileType,
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
      error: error?.message || 'Upload failed'
    });
  }
}
