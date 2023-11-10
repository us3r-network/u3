import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { lensPublicationToPostCardData } from '../../../../utils/social/lens/v1/lens-ui-utils';
import LensPostCardContent from './LensPostCardContent';
import PostCard, { PostCardData } from '../../PostCard';
import { getSocialDetailShareUrlWithLens } from '../../../../utils/shared/share';

export default function LensPostCardV1({
  data,
  cardClickAction,
}: {
  data: any;
  cardClickAction?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) {
  const navigate = useNavigate();

  const publication = data;

  const cardData = useMemo<PostCardData>(
    () => lensPublicationToPostCardData(publication),
    [publication]
  );

  const replyDisabled = true;
  const repostDisabled = true;
  return (
    <PostCard
      // eslint-disable-next-line react/no-unstable-nested-components
      contentRender={() => <LensPostCardContent publication={publication} />}
      id={data.id}
      onClick={(e) => {
        cardClickAction?.(e);
        navigate(`/social/post-detail/lens/${data.id}`);
      }}
      data={cardData}
      replyDisabled={replyDisabled}
      repostDisabled={repostDisabled}
      shareLink={getSocialDetailShareUrlWithLens(data.id)}
      shareLinkEmbedTitle={
        data?.metadata?.description || data?.metadata?.content
      }
    />
  );
}
