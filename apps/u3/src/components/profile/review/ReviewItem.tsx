import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { UserAvatar, UserName } from '@us3r-network/profile';
import CardBase from '../../common/card/CardBase';
import { ReactComponent as CheckVerifiedSvg } from '../../common/assets/svgs/check-verified.svg';
import EllipsisText from '../../common/text/EllipsisText';
import ScoreRateValue from '../../common/score/ScoreRateValue';
import ImgDefault from '../../common/ImgDefault';
import { DappStatus } from '../../../services/dapp/types/dapp';

export type ReviewItemData = {
  value: number;
  text: string;
  link?: {
    name?: string;
    image?: string;
    status?: string;
  };
};

type ReviewItemProps = StyledComponentPropsWithRef<'div'> & {
  data: ReviewItemData;
};
export default function ReviewItem({ data }: ReviewItemProps) {
  return (
    <Wrapper>
      <Header>
        <Logo src={data?.link?.image} />
        <Title>{data?.link?.name}</Title>
        {data?.link?.status === DappStatus.VERIFIED && <CheckVerifiedSvg />}
      </Header>
      <Divider className="divider" />
      <ScoreRow>
        <Avatar className="avatar-box" />
        <Name className="name-box" />
        <ScoreValue value={data.value} className="score-box" />
      </ScoreRow>
      <Text className="text-box">{data.text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  border: none;
  background: #14171a;
  border-radius: 10px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  svg {
    margin-right: auto;
  }
`;

const Logo = styled(ImgDefault)`
  width: 48px;
  height: 48px;
  border-radius: 10px;
`;
const Title = styled(EllipsisText)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;

const Divider = styled.div`
  width: 100%;
  height: 1px;
  background: #39424c;
  opacity: 0.5;
  margin: 20px 0px;
`;

const ScoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Avatar = styled(UserAvatar)`
  width: 48px;
  height: 48px;
`;
const Name = styled(UserName)`
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #ffffff;
`;
const ScoreValue = styled(ScoreRateValue)`
  margin-left: auto;
`;
const Text = styled.span`
  display: inline-block;
  margin-top: 20px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
`;
