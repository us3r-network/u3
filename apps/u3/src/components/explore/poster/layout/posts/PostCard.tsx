import styled, { StyledComponentPropsWithRef } from 'styled-components';
import EllipsisText from '../../../../common/text/EllipsisText';

export type PostCardData = {
  title: string;
  authorDisplayName: string;
  authorHandle: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: PostCardData;
  isFirst?: boolean;
}
export default function PostCard({ data, isFirst, ...wrapperProps }: Props) {
  const { title, authorDisplayName, authorHandle } = data;
  if (isFirst) {
    return (
      <FirstCardWrapper {...wrapperProps}>
        <FirstLine />
        <FirstTitle row={3}>{title}</FirstTitle>
        <AuthorDisplayName>
          {authorDisplayName} {authorHandle && `@${authorHandle}`}
        </AuthorDisplayName>
      </FirstCardWrapper>
    );
  }
  return (
    <CardWrapper {...wrapperProps}>
      <Title row={2}>{title}</Title>
      <AuthorDisplayName>
        {authorDisplayName} {authorHandle && `@${authorHandle}`}
      </AuthorDisplayName>
    </CardWrapper>
  );
}

const CardWrapper = styled.div`
  width: 100%;
  overflow: hidden;
  display: flex;
  padding: 20px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  flex-shrink: 0;
  align-self: stretch;
`;
const Title = styled(EllipsisText)`
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
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
  box-sizing: border-box;
  display: flex;
  height: 300px;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;
const FirstLine = styled.span`
  display: inline-block;
  width: 40px;
  height: 4px;
  flex-shrink: 0;
  background: var(--14171-a, #14171a);
`;
const FirstTitle = styled(EllipsisText)`
  width: 100%;
  color: var(--14171-a, #14171a);
  font-family: Marion;
  font-size: 50px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
