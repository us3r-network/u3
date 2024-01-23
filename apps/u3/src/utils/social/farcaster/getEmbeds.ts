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
export function getEmbeds(cast: FarCast): {
  imgs: {
    url: string;
  }[];
  webpages: {
    url: string;
  }[];
  casts: {
    castId: { fid: number; hash: string };
  }[];
} {
  const imgs = [];
  const webpages = [];
  const casts = [];
  for (const embed of cast.embeds) {
    if (embed?.castId) {
      casts.push(embed);
    } else if (embed?.url) {
      if (isImg(embed.url)) {
        imgs.push({
          url: embed.url,
        });
      } else {
        webpages.push({
          url: embed.url,
        });
      }
    }
  }
  return { imgs, webpages, casts };
}
