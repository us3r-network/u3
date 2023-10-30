/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-01 15:41:39
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:14:37
 * @Description: file description
 */
import styled, { css, StyledComponentPropsWithRef } from 'styled-components';
import { ScoresAvg } from '@us3r-network/link';
import {
  DappExploreListItemResponse,
  DappStatus,
} from '../../services/dapp/types/dapp';
import EllipsisText from '../common/text/EllipsisText';
import ImgDefault from '../common/ImgDefault';
import CardBase from '../common/card/CardBase';
import CheckVerifiedSvg from '../common/assets/svgs/check-verified.svg';
import { formatFilterShowName } from '../../utils/shared/filter';
import Badge from './Badge';

export type DappExploreListItemData = DappExploreListItemResponse;
export type DappExploreListItemProps = StyledComponentPropsWithRef<'div'> & {
  data: DappExploreListItemData;
};
export default function DappExploreListItem({
  data,
  ...props
}: DappExploreListItemProps) {
  return (
    <ExploreListItemWrapper {...props}>
      <ListItemInner>
        <Banner src={data.headerPhoto} className="banner" />
        <Icon src={data.image} className="icon" />
        <InnerBody className="innerBody">
          <Title>
            <Name>{data.name}</Name>
            {data.status === DappStatus.VERIFIED && (
              <CheckVerified src={CheckVerifiedSvg} />
            )}
          </Title>

          <Desc row={3} className="desc">
            {data.description}
          </Desc>

          <BottomBox className="bottomBox">
            <TagsRow>
              {data?.types.map((item) => (
                <Badge key={item} text={formatFilterShowName(item)} />
              ))}
            </TagsRow>
            {data?.linkStreamId && <ScoresAvg linkId={data.linkStreamId} />}
          </BottomBox>
        </InnerBody>
      </ListItemInner>
    </ExploreListItemWrapper>
  );
}
const ExploreListItemWrapper = styled(CardBase)`
  width: 100%;
  height: 292px;
  padding: 0;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const ListItemInner = styled.div`
  width: 100%;
  height: 100%;
  transition: all 0.3s;
  position: relative;
  display: flex;
  flex-direction: column;
`;
const Banner = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const Icon = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
  border: 4px solid #1b1e23;
  box-sizing: border-box;
  position: absolute;
  top: 120px;
  left: 20px;
  transform: translateY(-50%);
`;
const InnerBody = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  padding: 20px;
  padding-top: 38px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Name = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const CheckVerified = styled.img`
  width: 18px;
  height: 18px;
`;
const Desc = styled(EllipsisText)`
  width: 100%;
  height: 50px;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #718096;
`;

const BottomBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
`;

const TagsRow = styled.div`
  width: 0px;
  flex: 1;
  display: flex;
  gap: 10px;
  overflow: hidden;
`;

const Score = styled.div``;

export const DappExploreListItemMobile = styled(DappExploreListItem)`
  padding: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;
  border-radius: 10px;
  height: auto;

  & > div {
    flex-direction: row;
  }

  .banner {
    display: none;
  }

  .icon {
    position: relative;
    left: unset;
    top: unset;
    transform: none;
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }

  .innerBody {
    padding: 0;
    height: auto;
    gap: 0px;
  }

  .bottomBox {
    order: 1;

    & > div:first-of-type {
      order: 2;
    }
    & > div:last-of-type {
      order: 1;
    }
  }

  .desc {
    -webkit-line-clamp: 1;
    height: auto;
    order: 2;
  }
`;
