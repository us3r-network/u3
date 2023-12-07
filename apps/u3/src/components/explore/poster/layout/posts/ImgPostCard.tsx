import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EllipsisText from '../../../../common/text/EllipsisText';

export type ImgPostCardData = {
  img: string;
  authorDisplayName: string;
  authorHandle: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: ImgPostCardData;
  isFirst?: boolean;
}
export default function ImgPostCard({ data, isFirst, ...wrapperProps }: Props) {
  const { img, authorDisplayName, authorHandle } = data;
  if (isFirst) {
    return (
      <FirstCardWrapper {...wrapperProps}>
        <FirstLine />
        <FirstImg src={img} />
        <AuthorDisplayName>
          {authorDisplayName} {authorHandle && `@${authorHandle}`}
        </AuthorDisplayName>
      </FirstCardWrapper>
    );
  }
  return (
    <CardWrapper {...wrapperProps}>
      <Img src={img} />
      <AuthorDisplayName>
        {authorDisplayName} {authorHandle && `@${authorHandle}`}
      </AuthorDisplayName>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  align-self: stretch;
`;
const AuthorDisplayName = styled(EllipsisText)`
  color: #000;
  leading-trim: both;
  text-edge: cap;
  font-family: Marion;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
const FirstCardWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  align-self: stretch;
`;
const FirstLine = styled.span`
  display: inline-block;
  width: 40px;
  height: 4px;
  flex-shrink: 0;
  background: var(--14171-a, #14171a);
`;

const Img = styled.img`
  width: 100%;
  height: 250px;
  border-radius: 10px;
  object-fit: cover;
`;
const FirstImg = styled(Img)`
  height: 425px;
`;
