/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:24:26
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Platform } from '../../services/types/common';
// import { getChainInfo } from '../../utils/chain';
import { defaultFormatFromNow } from '../../utils/time';
import EllipsisText from '../common/text/EllipsisText';
import RewardTag from './RewardTag';
import type { EventExploreListItemData } from './EventExploreList';

export type EventExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: EventExploreListItemData;
  isActive: boolean;
};
export const defaultStyle = {
  bgc: 'rgba(16, 16, 20, 0.1)',
  activeColor: '#FFFFFF',
};
export const styleMaps = {
  [Platform.GALXE]: {
    bgc: '#14171a',
    activeColor: '#FFFFFF',
  },
  [Platform.NOOX]: {
    bgc: 'rgba(56, 3, 168, 0.1)',
    activeColor: '#3803A8',
  },
  [Platform.POAP]: {
    bgc: 'rgba(148, 86, 209, 0.1)',
    activeColor: '#9456D1',
  },
  [Platform.QUEST3]: {
    bgc: 'rgba(203, 255, 4, 0.1)',
    activeColor: '#CBFF04',
  },
  [Platform.RABBIT_HOLE]: {
    bgc: 'rgba(160, 247, 189, 0.1)',
    activeColor: '#A0F7BD',
  },
  [Platform.LINK3]: {
    bgc: 'rgba(28, 91, 245, 0.1)',
    activeColor: '#1C5BF5',
  },
};
export default function EventExploreListItem({
  data,
  isActive,
  ...props
}: EventExploreListItemProps) {
  let style = defaultStyle;
  if (isActive && data?.platform?.name) {
    style = styleMaps[data.platform.name] || defaultStyle;
  }
  const { bgc, activeColor } = style;
  // const chainIconUrl = getChainInfo(data.chain)?.iconUrl;
  return (
    <EventExploreListItemWrapper
      bgc={bgc}
      isActive={isActive}
      activeColor={activeColor}
      {...props}
    >
      <ListItemInner>
        {data?.platform?.logo && <EventPlatformIcon src={data.platform.logo} />}
        <RightBox>
          <EventName row={isActive ? 999 : 2}>{data.name}</EventName>
          <CenterBox>
            <RewardTag value={data.reward} />
            {data?.endTime && (
              <EventStartTime>
                {defaultFormatFromNow(data.endTime)}
              </EventStartTime>
            )}
            {/* {chainIconUrl && <ChainIcon src={chainIconUrl} />} */}
          </CenterBox>
        </RightBox>
      </ListItemInner>
    </EventExploreListItemWrapper>
  );
}

const EventExploreListItemWrapper = styled.div<{
  bgc: string;
  isActive: boolean;
  activeColor: string;
}>`
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  padding: 16px;
  background: ${({ bgc }) => bgc};
  border-bottom: 1px solid #39424c;
  ${({ isActive, activeColor }) =>
    isActive &&
    `
    border-right: 4px solid  ${activeColor};
  `}
  transition: background-color 0.5s, box-shadow 0.5s;
  ${({ isActive }) =>
    !isActive &&
    `
    &:hover {
      & > * {
        transform: scale(1.05);
      }
    }
  `}
`;
const ListItemInner = styled.div`
  display: flex;
  gap: 10px;
  transition: all 0.3s;
`;
const RightBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const EventName = styled(EllipsisText)`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CenterBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;
const EventStartTime = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
const EventPlatformIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-left: auto;
`;
