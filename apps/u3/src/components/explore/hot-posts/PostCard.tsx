import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useMemo } from 'react';
import CardBase from '../../common/card/CardBase';
import EllipsisText from '../../common/text/EllipsisText';
import { HeartIcon3 } from '../../common/icons/HeartIcon';
import { SocialPlatform } from '../../../services/social/types';
import LensIcon from '../../common/icons/LensIcon';
import FarcasterIcon from '../../common/icons/FarcasterIcon';

export type PostCardData = {
  title: string;
  likesCount: number;
  authorAvatar: string;
  authorDisplayName: string;
  authorHandle: string;
  recReason?: string;
  platform: SocialPlatform;
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
    recReason = 'Interested Viewpoint',
    platform,
  } = data;
  const PlatFormIcon = useMemo(() => {
    switch (platform) {
      case SocialPlatform.Lens:
        return <LensIcon />;
      case SocialPlatform.Farcaster:
        return <FarcasterIcon />;
      default:
        return null;
    }
  }, [platform]);
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
            <RecReason>{recReason}</RecReason>
          </BottomLeft>

          {PlatFormIcon && (
            <PlatformIconWrapper>{PlatFormIcon}</PlatformIconWrapper>
          )}
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
      font-size: 30px;
      line-height: 36px;
      -webkit-line-clamp: 5;
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
    }
    .title {
      font-size: 18px;
      line-height: 24px;
      -webkit-line-clamp: 2;
      margin-bottom: 5px;
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
`;
const CardBody = styled.div`
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 20px;
  position: relative;
`;
const Title = styled(EllipsisText)`
  font-weight: 700;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const BottomWrapper = styled.div`
  height: 44px;
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 10px;
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
const PlatformIconWrapper = styled.div`
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }
`;
