import { useEffect, useMemo, useState } from 'react';
import { StyledComponentPropsWithRef } from 'styled-components';
import { getChannel } from 'src/utils/social/farcaster/getChannel';

import {
  FarCast,
  FarCastEmbedMeta,
  FarCastEmbedMetaCast,
} from '../../../services/social/types';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';
import PostCard, { PostCardData } from './PostCard';
import ImgPostCard, { ImgPostCardData } from './ImgPostCard';
import { getEmbeds, isImg } from '../../../utils/social/farcaster/getEmbeds';
import { getFarcasterEmbedMetadata } from '../../../services/social/api/farcaster';
import FarcasterImgUrl from '../../common/assets/pngs/farcaster.png';

interface Props extends StyledComponentPropsWithRef<'div'> {
  data: FarCast;
  farcasterUserData: { [key: string]: { type: number; value: string }[] };
}
export default function FarcasterPostCard({
  data,
  farcasterUserData,
  ...wrapperProps
}: Props) {
  const userData = useFarcasterUserData({ fid: data?.fid, farcasterUserData });

  const channel = useMemo(() => {
    const channelUrl = data.parent_url || data.rootParentUrl;
    return getChannel().find((c) => c.parent_url === channelUrl);
  }, [data]);

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

  const recReason = channel?.name ? `#${channel?.name}` : undefined;

  const platformIconUrl = channel?.image || FarcasterImgUrl;

  if (!data.text && (imgs.length > 0 || metadata.length > 0)) {
    let img = imgs[0]?.url;
    if (!img) {
      const firstMetadata = metadata[0];
      if ((firstMetadata as any).type === 'cast') {
        img = (firstMetadata as any).cast.embeds.find((item) =>
          isImg(item?.url)
        )?.url;
      } else if ((firstMetadata as any).collection) {
        img = (firstMetadata as any)?.image;
      } else {
        img = (firstMetadata as any)?.image;
      }
    }

    if (img) {
      const viewData: ImgPostCardData = {
        img,
        likesCount: Number(data.like_count || data.likesCount || 0),
        authorAvatar: userData.pfp,
        authorDisplayName: userData.display,
        authorHandle: userData.userName,
        recReason,
        platformIconUrl,
      };
      return <ImgPostCard data={viewData} {...wrapperProps} />;
    }
  }
  const viewData: PostCardData = {
    title: data?.text,
    likesCount: Number(data.like_count || data.likesCount || 0),
    authorAvatar: userData.pfp,
    authorDisplayName: userData.display,
    authorHandle: userData.userName,
    recReason,
    platformIconUrl,
  };
  return <PostCard data={viewData} {...wrapperProps} />;
}
