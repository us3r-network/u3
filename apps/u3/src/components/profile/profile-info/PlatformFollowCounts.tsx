import styled, { StyledComponentPropsWithRef } from 'styled-components';

interface PlatformFollowCountsProps extends StyledComponentPropsWithRef<'div'> {
  followersCount: number;
  followingCount: number;
  clickFollowing?: () => void;
  clickFollowers?: () => void;
}
export default function PlatformFollowCounts({
  followersCount,
  followingCount,
  clickFollowing,
  clickFollowers,
  ...wrapperProps
}: PlatformFollowCountsProps) {
  return (
    <CountsWrapper {...wrapperProps}>
      <CountItem onClick={clickFollowers}>
        <Count>{followersCount}</Count>
        <CountText>Followers</CountText>
      </CountItem>
      <CountItem onClick={clickFollowing}>
        <Count>{followingCount}</Count>
        <CountText>Following</CountText>
      </CountItem>
    </CountsWrapper>
  );
}

const CountsWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CountItem = styled.div<{ onClick: () => void }>`
  display: flex;
  align-items: center;
  gap: 5px;
  ${(props) => !!props.onClick && `cursor: pointer;`}
`;
const Count = styled.span`
  color: #fff;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const CountText = styled.span`
  color: #718096;

  /* Regular-16 */
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;
