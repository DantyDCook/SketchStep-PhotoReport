/** Validate an album link without fetching or retaining it. */
export function parseAlbumUrl(value) {
  let url;
  try { url = new URL(String(value).trim()); }
  catch { throw new Error('Enter a valid HTTPS Google Photos album link.'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) throw new Error('Use an HTTPS Google Photos album link.');
  const short = url.hostname === 'photos.app.goo.gl' && /^\/[A-Za-z0-9_-]+\/?$/.test(url.pathname);
  const full = url.hostname === 'photos.google.com' && /^\/(?:u\/\d+\/)?(?:share|album)\/[A-Za-z0-9_-]+(?:\/)?$/.test(url.pathname);
  if (!short && !full) throw new Error('Use a Google Photos shared album link (photos.app.goo.gl or photos.google.com/share/…).');
  return url.href;
}
