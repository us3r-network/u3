import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { defaultFormatFromNow } from '../../utils/shared/time';
import EllipsisText from '../common/text/EllipsisText';
import LinkBox from '../news/contents/LinkBox';
import type { SaveExploreListItemData } from './SaveExploreList';

export type SaveExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: SaveExploreListItemData;
};

export default function SaveExploreListItem({
  data,
  ...props
}: SaveExploreListItemProps) {
  // console.log('save item', data);
  return (
    <Wrapper {...props}>
      <ListItemInner>
        <IconLink text={data.url} logo={data?.logo} className="iconLink" />
        <TitleText>{data.title || data.url}</TitleText>
        {!!data?.createAt && (
          <TimeText className="timeText">
            {defaultFormatFromNow(data.createAt)}
          </TimeText>
        )}
      </ListItemInner>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 200px;
  padding: 20px;
  box-sizing: border-box;
  background: #1b1e23;
  border: 1px solid #39424c;
  border-radius: 20px;
  position: relative;
  cursor: pointer;
  color: #ffffff;
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
  gap: 20px;
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

const IconLink = styled(LinkBox)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0;
  box-sizing: border-box;
  gap: 6px;
  background: #14171a;
  border-radius: 100px;

  img {
    width: 20px;
    height: 20px;
  }
  span {
    font-weight: 400;
    font-size: 14px;
    line-height: 18px;
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
