import { handleUpload } from '@vercel/blob/client';

const MAX_IMAGE = 25 * 1024 * 1024;
const MAX_VIDEO = 1024 * 1024 * 1024;
const SAFE_TYPES = [
  'image/jpeg','image/png','image/webp','image/gif','image/avif',
  'video/mp4','video/webm','video/ogg','video/quicktime'
];

async function readJsonBody(request) {
  if (request?.body && typeof request.body === 'object' && !Buffer.isBuffer(request.body)) return request.body;
  if (typeof request?.body === 'string') return JSON.parse(request.body);
  if (Buffer.isBuffer(request?.body)) return JSON.parse(request.body.toString('utf8'));
  const chunks=[];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  const raw=Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error:'Method not allowed' });
  try {
    const body = await readJsonBody(request);
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload, multipart) => {
        let meta={};
        try { meta=clientPayload ? JSON.parse(clientPayload) : {}; } catch {}
        const contentType=String(meta.contentType||'').toLowerCase();
        const size=Number(meta.size||0);
        const kind=String(meta.kind||'media');
        if (!SAFE_TYPES.includes(contentType)) throw new Error('Unsupported file type.');
        const max=(kind==='background-video'||contentType.startsWith('video/'))?MAX_VIDEO:MAX_IMAGE;
        if (!size || size>max) throw new Error(`File is too large. Maximum is ${contentType.startsWith('video/')?'1 GB':'25 MB'}.`);
        return {
          allowedContentTypes:[contentType],
          maximumSizeInBytes:max,
          addRandomSuffix:true,
          tokenPayload:JSON.stringify({ kind, contentType, size, multipart:!!multipart })
        };
      },
      onUploadCompleted: async ({blob}) => {
        console.log('Blob upload completed:', blob?.url);
      }
    });
    return response.status(200).json(result);
  } catch (error) {
    console.error('Blob client upload error:', error);
    return response.status(500).json({ error:error?.message||'Could not prepare Blob upload.' });
  }
}
