import 'server-only';
import { put, del } from '@vercel/blob';

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
]);

export type UploadResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

// Sube un archivo a Vercel Blob bajo el prefijo `prefix/`. Devuelve la URL
// pública (es un blob public read). Si BLOB_READ_WRITE_TOKEN no está
// seteado (dev sin Blob conectado), devuelve un error explícito.
export async function uploadFile(
  prefix: string,
  file: File,
): Promise<UploadResult> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      error:
        'Storage no configurado. Conectá Vercel Blob desde el panel de Vercel.',
    };
  }
  if (file.size === 0) {
    return { ok: false, error: 'El archivo está vacío.' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: `El archivo supera ${MAX_BYTES / 1024 / 1024} MB.` };
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return {
      ok: false,
      error: 'Tipo de archivo no permitido. Subí PDF, JPG, PNG o WEBP.',
    };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  const key = `${prefix}/${Date.now()}-${safeName}`;

  try {
    const blob = await put(key, file, {
      access: 'public',
      addRandomSuffix: true,
    });
    return { ok: true, url: blob.url };
  } catch (e) {
    console.error('[blob] upload error:', e);
    return { ok: false, error: 'No pudimos subir el archivo. Probá de nuevo.' };
  }
}

export async function deleteFile(url: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return;
  try {
    await del(url);
  } catch (e) {
    console.error('[blob] delete error:', e);
  }
}
