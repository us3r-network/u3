/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:24:44
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Reward } from '../../../services/shared/types/common';
import { defaultFormatFromNow } from '../../../utils/shared/time';
import { ButtonPrimaryLine } from '../../common/button/ButtonBase';
import CardBase from '../../common/card/CardBase';
import CompleteSvg from '../common/assets/svgs/check-circle.svg';
import CompletedSvg from '../common/assets/svgs/check.svg';
import Tag from '../../common/tag/Tag';
import RewardTag from './RewardTag';

export type EventLinkCardData = {
  name: string;
  link: string;
  startTime: number;
  endTime: number;
  reward: Reward;
  platform?: {
    name: string;
    logo: string;
  };
};

export type EventLinkCardProps = StyledComponentPropsWithRef<'div'> & {
  data: EventLinkCardData;
  displayComplete?: boolean;
  disabledComplete?: boolean;
  loadingComplete?: boolean;
  isCompleted?: boolean;
  onComplete?: () => void;
};
export default function EventLinkCard({
  data,
  displayComplete = true,
  disabledComplete,
  loadingComplete,
  isCompleted,
  onComplete,
  ...props
}: EventLinkCardProps) {
  return (
    <EventLinkCardWrapper
      onClick={() => window.open(data.link, '__blank')}
      {...props}
    >
      <ListItemInner>
        <LayoutLeft>
          <PlatformImg src={data.platform.logo} />
        </LayoutLeft>

        <LayoutCenter>
          <LayoutCenterRow>
            <EventName>{data.name}</EventName>
          </LayoutCenterRow>
          <LayoutCenterRow>
            <RewardTag value={data.reward} />
            <LayoutText>{defaultFormatFromNow(data.startTime)}</LayoutText>
          </LayoutCenterRow>
        </LayoutCenter>
        {displayComplete && (
          <EventHandleButton
            onClick={(e) => {
              e.stopPropagation();
              if (onComplete) onComplete();
            }}
            disabled={disabledComplete}
          >
            <EventHandleButtonIcon
              src={isCompleted ? CompletedSvg : CompleteSvg}
            />
            <EventHandleButtonText>
              {loadingComplete
                ? 'loading'
                : isCompleted
                ? 'Archived'
                : 'Archive'}
            </EventHandleButtonText>
          </EventHandleButton>
        )}
      </ListItemInner>
    </EventLinkCardWrapper>
  );
}
const EventLinkCardWrapper = styled(CardBase)`
  background: #14171a;
  width: 100%;
  cursor: pointer;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s;
`;
const LayoutLeft = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;
const PlatformImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
const LayoutCenter = styled.div`
  width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const LayoutCenterRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;
const EventReward = styled(Tag)``;
const EventName = styled.span`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const LayoutText = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #718096;
`;
const EventHandleButton = styled(ButtonPrimaryLine)`
  padding: 6px;
  height: 32px;
`;
const EventHandleButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const EventHandleButtonText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #ffffff;
  white-space: nowrap;
`;
