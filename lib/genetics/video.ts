// Genéticas que tienen un video loop para la interna (/dispensario/[slug]).
// Los archivos viven en /public/dispensario/videos/<slug>.mp4 (comprimidos a
// ~720p sin audio, faststart). No se chequea el filesystem en runtime porque
// en Vercel los assets de /public los sirve el CDN y NO están en el lambda.
// Sumar un video nuevo = dejar el .mp4 acá y agregar el slug a este set.
const SLUGS_WITH_VIDEO = new Set<string>(['pusherman', 'berry-blotto', 'herb-and-turf']);

export function geneticVideoSrc(slug: string): string | null {
  return SLUGS_WITH_VIDEO.has(slug) ? `/dispensario/videos/${slug}.mp4` : null;
}
