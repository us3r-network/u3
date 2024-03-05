import { FarCast } from '../../../services/social/types';

export function isImg(url?: string) {
  if (!url) return false;
  return (
    url.endsWith('.png') ||
    url.endsWith('.jpg') ||
    url.endsWith('.jpeg') ||
    url.endsWith('.gif')
  );
}

export function isVideo(url?: string) {
  if (!url) return false;
  return (
    url.endsWith('.mp4') ||
    url.endsWith('.mov') ||
    url.endsWith('.avi') ||
    url.endsWith('.webm') ||
    url.endsWith('.mkv') ||
    url.endsWith('.m3u8')
  );
}
export function getEmbeds(cast: FarCast): {
  imgs: {
    url: string;
  }[];
  videos: { url: string }[];
  webpages: {
    url: string;
  }[];
  casts: {
    castId: { fid: number; hash: string };
  }[];
} {
  const imgs = [];
  const videos = [];
  const webpages = [];
  const casts = [];

  console.log('cast', cast.embeds);
  for (const embed of cast.embeds) {
    if (embed?.castId) {
      casts.push(embed);
    } else if (embed?.url) {
      if (isImg(embed.url)) {
        imgs.push({
          url: embed.url,
        });
      } else if (isVideo(embed.url)) {
        videos.push({
          url: embed.url,
        });
      } else {
        webpages.push({
          url: embed.url,
        });
      }
    }
  }
  return { imgs, webpages, casts, videos };
}
