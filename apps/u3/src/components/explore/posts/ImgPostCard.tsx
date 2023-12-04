import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { useMemo } from 'react';

import { isMobile } from 'react-device-detect';
import CardBase from '../../common/card/CardBase';
import EllipsisText from '../../common/text/EllipsisText';
import { HeartIcon3 } from '../../common/icons/HeartIcon';
import { SocialPlatform } from '../../../services/social/types';
import LensIcon from '../../common/icons/LensIcon';
import FarcasterIcon from '../../common/icons/FarcasterIcon';

export type ImgPostCardData = {
  img: string;
  likesCount: number;
  authorAvatar: string;
  authorDisplayName: string;
  authorHandle: string;
  recReason?: string;
  platform: SocialPlatform;
};
interface Props extends StyledComponentPropsWithRef<'div'> {
  data: ImgPostCardData;
}
export default function PostCard({ data, ...wrapperProps }: Props) {
  const {
    img,
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
        <Img className="img" src={img} />
        <BottomWrapper>
          <BottomLeft>
            <UserWrapper className="user-wrapper">
              <CountWrapper>
                <HeartIcon3 />
                <LikesCount>{likesCount}</LikesCount>
              </CountWrapper>
              <DividingLine className="dividing-line" />
              <UserNameWrapper>
                <AuthorAvatar src={authorAvatar} />
                <AuthorDisplayName>
                  {authorDisplayName} {authorHandle && `@${authorHandle}`}
                </AuthorDisplayName>
              </UserNameWrapper>
            </UserWrapper>
            {!isMobile && <RecReason>{recReason}</RecReason>}
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
    .img {
      width: 100%;
      height: 223px;
      object-fit: cover;
      border-radius: 10px;
      ${isMobile &&
      `
        height: 160px;
      `}
    }
    .card-body {
      flex-direction: column;
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
    .img {
      width: 195px;
      height: 100%;
      object-fit: cover;
      ${isMobile &&
      `
        width: 100%;
        height: 160px;
      `}
    }
    .user-wrapper {
      flex-direction: column;
      align-items: flex-start;
      ${isMobile &&
      `
        flex-direction: row;
        align-items: center;
      `}
    }
    .dividing-line {
      display: none;
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
    .img {
      width: 97px;
      height: 100%;
      object-fit: cover;
      ${isMobile &&
      `
        width: 100%;
        height: 160px;
      `}
    }
    .user-wrapper {
      flex-direction: column;
      align-items: flex-start;
      ${isMobile &&
      `
        flex-direction: row;
        align-items: center;
      `}
    }
    .dividing-line {
      display: none;
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
  justify-content: space-between;
  gap: 20px;
  position: relative;
  ${isMobile &&
  `
    flex-direction: column;
    gap: 10px;
      `}
`;
const Img = styled.img`
  border-radius: 10px;
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
const CountWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const UserNameWrapper = styled.div`
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
    ${isMobile &&
    `
      width: 14px;
      height: 14px;
    `}
  }
`;
