import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { defaultFormatFromNow } from '../../utils/time';
import EllipsisText from '../common/text/EllipsisText';
import LinkBox from '../contents/LinkBox';
import type { SaveExploreListItemData } from './SaveExploreList';

export type SaveExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: SaveExploreListItemData;
};

export default function SaveExploreListItem({
  data,
  ...props
}: SaveExploreListItemProps) {
  return (
    <Wrapper {...props}>
      <ListItemInner>
        <TopBox>
          <TitleText>{data.title}</TitleText>

          {!!data?.createAt && (
            <TimeText className="timeText">
              {defaultFormatFromNow(data.createAt)}
            </TimeText>
          )}
        </TopBox>
        <BottomBox className="bottomBox">
          <IconLink text={data.url} logo={data?.logo} className="iconLink" />
        </BottomBox>
      </ListItemInner>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 105px;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background: rgba(20, 23, 26, 0.3);
  }
`;
const ListItemInner = styled.div`
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
`;
const TopBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;
const TitleText = styled(EllipsisText)`
  flex: 1;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const TimeText = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;

  color: #718096;
`;
const BottomBox = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const IconLink = styled(LinkBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 20px 8px 16px;
  box-sizing: border-box;
  gap: 8px;
  height: 36px;
  background: #14171a;
  border-radius: 100px;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 17px;
    color: #718096;
  }
`;

export const SaveExploreListItemMobile = styled(SaveExploreListItem)`
  padding: 10px;
  height: auto;

  & > div {
    position: relative;
  }

  .timeText {
    position: absolute;
    right: 10px;
    bottom: 2px;
  }

  .bottomBox {
    padding-right: 100px;
    .iconLink {
      padding: 0;
      height: auto;
    }
  }
`;
