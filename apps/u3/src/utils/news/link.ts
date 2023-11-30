export function extractYoutubeVideoId(url: string) {
  const patterns = ['v=', 'youtu.be/', '/embed/', '/live/', '/shorts/'];
  if (!url) return null;
  let videoId = '';
  patterns.forEach((pattern) => {
    if (url.indexOf(pattern) > 0) {
      [, videoId] = url.split(pattern);
      [videoId] = videoId.split('&');
    }
  });
  return videoId;
}

export function encodeLinkURL(url: string) {
  return encodeURIComponent(Buffer.from(url, 'utf8').toString('base64'));
}
export function decodeLinkURL(url: string) {
  return Buffer.from(decodeURIComponent(url), 'base64').toString('utf8');
}
