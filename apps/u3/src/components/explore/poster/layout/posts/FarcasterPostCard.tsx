import { StyledComponentPropsWithRef } from 'styled-components';
import { FarCast } from '../../../../../services/social/types';
import useFarcasterUserData from '../../../../../hooks/social/farcaster/useFarcasterUserData';
import PostCard, { PostCardData } from './PostCard';
import ImgPostCard, { ImgPostCardData } from './ImgPostCard';

interface Props extends StyledComponentPropsWithRef<'div'> {
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
  if (!data.text && data.embeds?.length > 0) {
    const viewData: ImgPostCardData = {
      img: data.embeds[0].url,
      authorDisplayName: userData.display,
      authorHandle: userData.userName,
    };
    return <ImgPostCard data={viewData} isFirst={isFirst} {...wrapperProps} />;
  }
  const viewData: PostCardData = {
    title: data?.text,
    authorDisplayName: userData.display,
    authorHandle: userData.userName,
  };
  return <PostCard data={viewData} isFirst={isFirst} {...wrapperProps} />;
}
