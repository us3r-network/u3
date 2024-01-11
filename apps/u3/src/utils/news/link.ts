/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 15:43:39
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 15:42:59
 * @FilePath: /u3/apps/u3/src/utils/news/link.ts
 * @Description:
 */
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
export function processMetadata(metadata) {
  if (
    metadata?.url.indexOf('twitter.com') > 0 ||
    metadata?.url.indexOf('x.com') > 0
  ) {
    metadata.title = `${metadata.title}: ${metadata.description}`;
  } else if (metadata?.url.indexOf('aburra.xyz') > 0) {
    metadata.title = metadata.description;
  }
  return metadata;
}

const DOMAINS_DO_NOT_SUPPORT_IFRAME = [
  'substack.com',
  'github.com',
  'bountycaster.xyz',
  'arxiv.org',
];
export function checkSupportIframe(url) {
  const domain = url.split('/')[2];
  let support = true;
  DOMAINS_DO_NOT_SUPPORT_IFRAME.forEach((item) => {
    if (domain.indexOf(item) >= 0) support = false;
  });
  return support;
}
