import styled, { StyledComponentPropsWithRef } from 'styled-components';

import { isMobile } from 'react-device-detect';
import { ComponentPropsWithRef } from 'react';
import CardBase from '../../common/card/CardBase';
import EllipsisText from '../../common/text/EllipsisText';
import { HeartIcon3 } from '../../common/icons/HeartIcon';
import { cn } from '@/lib/utils';

export type PostCardData = {
  title: string;
  likesCount: number;
  authorAvatar: string;
  authorDisplayName: string;
  authorHandle: string;
  recReason?: string;
  platformIconUrl?: string;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: PostCardData;
}
export default function PostCard({ data, ...wrapperProps }: Props) {
  const {
    title,
    likesCount,
    authorAvatar,
    authorDisplayName,
    authorHandle,
    recReason = '#High Effort',
    platformIconUrl,
  } = data;

  return (
    <CardWrapper {...wrapperProps}>
      <CardBody className="card-body">
        <Title className="title">{title}</Title>
        <BottomWrapper>
          <BottomLeft>
            <UserWrapper>
              <HeartIcon3 />
              <LikesCount>{likesCount}</LikesCount>
              <DividingLine />
              <AuthorAvatar src={authorAvatar} />
              <AuthorDisplayName>
                {authorDisplayName} {authorHandle && `@${authorHandle}`}
              </AuthorDisplayName>
            </UserWrapper>
            <div className="flex items-center gap-[10px]">
              {platformIconUrl && <PlatformIcon src={platformIconUrl} />}
              <RecReason>{recReason}</RecReason>
            </div>
          </BottomLeft>
        </BottomWrapper>
      </CardBody>
    </CardWrapper>
  );
}

const CardWrapper = styled(CardBase)`
  cursor: pointer;
  overflow: hidden;
  &:nth-child(1) {
    grid-column-start: 1;
    grid-column-end: 4;
    grid-row-start: 1;
    grid-row-end: 3;
    .title {
      font-size: 18px;
      line-height: 24px;
      -webkit-line-clamp: 5;

      ${isMobile &&
      `
        font-size: 16px;
        line-height: 21px;
         -webkit-line-clamp: 2;
      `}
    }
  }
  &:nth-child(2) {
    grid-row-start: 1;
    grid-row-end: 2;
  }
  &:nth-child(3) {
    grid-row-start: 2;
    grid-row-end: 3;
  }
  &:nth-child(2),
  &:nth-child(3) {
    grid-column-start: 4;
    grid-column-end: 7;
    .card-body {
      gap: 6px;
      ${isMobile &&
      `
        gap: 10px;
      `}
    }
    .title {
      font-size: 18px;
      line-height: 24px;
      -webkit-line-clamp: 2;
      margin-bottom: 5px;
      ${isMobile &&
      `
        font-size: 16px;
        line-height: 21px;
         -webkit-line-clamp: 2;
      `}
    }
  }

  &:nth-child(4) {
    grid-column-start: 1;
    grid-column-end: 3;
  }
  &:nth-child(5) {
    grid-column-start: 3;
    grid-column-end: 5;
  }
  &:nth-child(6) {
    grid-column-start: 5;
    grid-column-end: 7;
  }
  &:nth-child(4),
  &:nth-child(5),
  &:nth-child(6) {
    grid-row-start: 3;
    grid-row-end: 4;
    .card-body {
      gap: 15px;
      ${isMobile &&
      `
        gap: 10px;
      `}
    }
    .title {
      font-size: 16px;
      line-height: 21px;
      -webkit-line-clamp: 2;
    }
  }
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
  ${isMobile &&
  `
    padding: 10px;
    border-radius: 10px;
  `}
`;
const CardBody = styled.div`
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  position: relative;
  ${isMobile &&
  `
    gap: 10px;
  `}
`;
const Title = styled(EllipsisText)`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  ${isMobile &&
  `
    font-size: 16px;
    line-height: 19px;
    font-weight: 500;
  `}
`;
const BottomWrapper = styled.div`
  height: 44px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 10px;
  ${isMobile &&
  `
      height: auto;
    `}
`;
const BottomLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const UserWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const LikesCount = styled.span`
  color: #ffffff;
  text-align: center;

  /* Regular-14 */
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
`;
const DividingLine = styled.span`
  display: inline-block;
  width: 1px;
  height: 10px;
  background: #718096;
`;
const AuthorAvatar = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;
const AuthorDisplayName = styled(EllipsisText)`
  color: #718096;
  font-size: 12px;
  font-weight: 400;
  line-height: normal;
`;

const RecReason = styled.div`
  /* Regular-14 */
  font-size: 14px;
  font-weight: 400;
  line-height: normal;
  background: linear-gradient(52deg, #cd62ff 35.31%, #62aaff 89.64%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
function PlatformIcon({ className, ...props }: ComponentPropsWithRef<'img'>) {
  return (
    <img
      className={cn(
        'w-[14px] h-[14px] rounded-[50%]  object-cover flex-shrink-0',
        className || ''
      )}
      alt=""
      {...props}
    />
  );
}
