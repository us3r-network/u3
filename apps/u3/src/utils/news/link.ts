/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 15:43:39
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 15:42:59
 * @FilePath: /u3/apps/u3/src/utils/news/link.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
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
