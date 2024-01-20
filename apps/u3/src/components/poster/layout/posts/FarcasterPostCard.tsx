import { ComponentPropsWithRef, useEffect, useMemo, useState } from 'react';
import {
  FarCast,
  FarCastEmbedMeta,
  FarCastEmbedMetaCast,
} from '../../../../services/social/types';
import useFarcasterUserData from '../../../../hooks/social/farcaster/useFarcasterUserData';
import { PostCard, Top1PostCard, type PostCardData } from './PostCard';
import { getEmbeds, isImg } from '@/utils/social/farcaster/getEmbeds';
import { getFarcasterEmbedMetadata } from '@/services/social/api/farcaster';

interface Props extends ComponentPropsWithRef<'div'> {
  data: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
  isFirst?: boolean;
}
export default function FarcasterPostCard({
  data,
  farcasterUserData,
  isFirst,
  ...wrapperProps
}: Props) {
  const userData = useFarcasterUserData({ fid: data?.fid, farcasterUserData });

  const embeds = useMemo(() => getEmbeds(data), [data]);
  const { imgs, webpages } = embeds;

  const [metadata, setMetadata] = useState<
    (FarCastEmbedMeta | FarCastEmbedMetaCast)[]
  >([]);

  const getEmbedWebpagesMetadata = async () => {
    const urls = webpages.map((embed) => embed.url);
    if (urls.length === 0) return;
    try {
      const res = await getFarcasterEmbedMetadata([urls[0]]);
      const { metadata: respMetadata } = res.data.data;
      const d = respMetadata.flatMap((m) => (m ? [m] : []));
      setMetadata(d);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  useEffect(() => {
    getEmbedWebpagesMetadata();
  }, [webpages]);

  let img = imgs[0]?.url;
  if (!img) {
    const firstMetadata = metadata[0];
    if ((firstMetadata as any)?.type === 'cast') {
      img = (firstMetadata as any).cast.embeds.find((item) =>
        isImg(item?.url)
      )?.url;
    } else if ((firstMetadata as any)?.collection) {
      img = (firstMetadata as any)?.image;
    } else {
      img = (firstMetadata as any)?.image;
    }
  }

  const viewData: PostCardData = {
    title: data?.text,
    img,
    authorAvatar: userData.pfp,
    authorDisplayName: userData.display,
    authorHandle: userData.userName,
  };
  if (isFirst) {
    return <Top1PostCard data={viewData} {...wrapperProps} />;
  }
  return <PostCard data={viewData} {...wrapperProps} />;
}
