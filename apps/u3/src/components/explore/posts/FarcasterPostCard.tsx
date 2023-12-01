import { StyledComponentPropsWithRef } from 'styled-components';
import { FarCast, SocialPlatform } from '../../../services/social/types';
import useFarcasterUserData from '../../../hooks/social/farcaster/useFarcasterUserData';
import PostCard, { PostCardData } from './PostCard';

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
  const viewData: PostCardData = {
    title: data?.text,
    likesCount: Number(data.like_count || data.likesCount || 0),
    authorAvatar: userData.pfp,
    authorDisplayName: userData.display,
    authorHandle: userData.userName,
    platform: SocialPlatform.Farcaster,
  };
  return <PostCard data={viewData} {...wrapperProps} />;
}
