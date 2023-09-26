import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Post, Comment } from '@lens-protocol/react-web';
import getMetadataImg from '../../../utils/lens/getMetadataImg';
import { PostCardContentWrapper, PostCardShowMoreWrapper } from '../PostCard';

type Props = {
  publication: Post | Comment;
  isDetail?: boolean;
};
export default function LensPostCardContent({ publication, isDetail }: Props) {
  const img = useMemo(() => getMetadataImg(publication), [publication]);
  const markdownContent = useMemo(() => {
    let content = publication?.metadata?.content;
    if (!content) return '';
    content = content.replace(
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi,
      '[$1]($1)'
    );
    return content;
  }, [publication]);

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
        <ReactMarkdown linkTarget="_blank">{markdownContent}</ReactMarkdown>
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
