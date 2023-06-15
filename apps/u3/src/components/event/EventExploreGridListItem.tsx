/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:21:32
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { EventExploreListItemResponse } from '../../services/types/event';
import { getChainInfo } from '../../utils/chain';
import isUrl from '../../utils/isUrl';
import { defaultFormatFromNow } from '../../utils/time';
import RewardTag from './RewardTag';

export type EventExploreGridListItemData = EventExploreListItemResponse;
export type EventExploreGridListItemProps =
  StyledComponentPropsWithRef<'div'> & {
    data: EventExploreGridListItemData;
  };

export default function EventExploreGridListItem({
  data,
  ...props
}: EventExploreGridListItemProps) {
  const { image, project, platform } = data;
  const img = isUrl(image)
    ? image
    : isUrl(project?.image)
    ? project.image
    : isUrl(platform?.logo)
    ? platform.logo
    : '';
  // const chainIconUrl = getChainInfo(data.chain)?.iconUrl;
  return (
    <EventExploreGridListItemWrapper {...props}>
      <ListItemInner>
        <TopBox>
          <EventImg src={img} />
          <PlatformIcon src={data.platform.logo} title={data.link} />
        </TopBox>
        <BottomBox>
          <EventTitle>{data.name}</EventTitle>
          <BottomColumn>
            <BottomRow>
              <RewardTag value={data.reward} />
              {/* {chainIconUrl && <ChainIcon src={chainIconUrl} />} */}

              {data?.endTime && (
                <EventStartTime>
                  {defaultFormatFromNow(data.endTime)}
                </EventStartTime>
              )}
            </BottomRow>
          </BottomColumn>
        </BottomBox>
      </ListItemInner>
    </EventExploreGridListItemWrapper>
  );
}
const EventExploreGridListItemWrapper = styled.div`
  width: 100%;
  height: 312px;
  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
`;
const ListItemInner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;
const TopBox = styled.div`
  width: 100%;
  height: 200px;
  flex-shrink: 0;
  position: relative;
`;
const EventImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  &:before {
    content: ' ';
    display: block;
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: inherit;
    padding: 2px;
    box-sizing: border-box;
  }
`;
const PlatformIcon = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  right: 20px;
  bottom: 0;
  transform: translateY(50%);
`;
const BottomBox = styled.div`
  flex: 1;
  overflow: hidden;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: space-between;
`;

const EventTitle = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
  overflow: hidden;

  text-overflow: ellipsis;

  display: -webkit-box;

  -webkit-box-orient: vertical;

  -webkit-line-clamp: 2;
`;

const BottomRow = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;
const BottomColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const ChainIcon = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;
const EventStartTime = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
  margin-left: auto;
`;
