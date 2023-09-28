import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Post, Comment } from '@lens-protocol/react-web';
import getMetadataImg from '../../../utils/lens/getMetadataImg';
import { PostCardContentWrapper, PostCardShowMoreWrapper } from '../PostCard';
import Markup from './Markup';

type Props = {
  publication: Post | Comment;
  isDetail?: boolean;
};
export default function LensPostCardContent({ publication, isDetail }: Props) {
  const img = useMemo(() => getMetadataImg(publication), [publication]);
  const markdownContent = useMemo(
    () => publication?.metadata?.content || '',
    [publication]
  );

  const viewRef = useRef<HTMLDivElement>(null);
  const [showMore, setShowMore] = useState(false);
  useEffect(() => {
    if (isDetail) return;
    if (!viewRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (entry.target.clientHeight > 125) {
          setShowMore(true);
        }

        observer.disconnect();
      }
    });

    observer.observe(viewRef.current);
    // eslint-disable-next-line consistent-return
    return () => {
      observer.disconnect();
    };
  }, [isDetail]);

  return (
    <>
      <PostCardContentWrapper ref={viewRef} showMore={showMore}>
        <Markup>{markdownContent}</Markup>
      </PostCardContentWrapper>
      {showMore && (
        <PostCardShowMoreWrapper>
          <button type="button">Show more</button>
        </PostCardShowMoreWrapper>
      )}
      {!!img && <Image src={img} />}
    </>
  );
}

const Image = styled.img`
  width: 60%;
  object-fit: cover;
`;
