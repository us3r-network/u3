import { usePersonalScores } from '@us3r-network/link';
import styled from 'styled-components';
import CardBase from '../../common/card/CardBase';
import ReviewItem from './ReviewItem';
import Loading from '../../common/loading/Loading';
import { getDappLinkDataWithJsonValue } from '../../../utils/dapp';

export default function ReviewsMobile() {
  const { isFetching, personalScores } = usePersonalScores();
  const dapps = personalScores.filter((item) => item?.link?.type === 'dapp');
  const list = dapps.map((item) => {
    const linkData = getDappLinkDataWithJsonValue(item?.link?.data);
    return {
      ...item,
      link: linkData,
    };
  });

  return (
    <Wrapper>
      <Title>My Reviews ({list.length})</Title>
      {isFetching ? (
        <StatusBox>
          <Loading />
        </StatusBox>
      ) : (
        <List>
          {list.map((item) => (
            <ReviewItem key={item.id} data={item} />
          ))}
        </List>
      )}
    </Wrapper>
  );
}

const Wrapper = styled(CardBase)`
  background: transparent;
  border: none;
  padding-left: 0;
  padding-right: 0;
`;

const Title = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
`;
const List = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  & > div {
    /* padding: 0; */
    border: 1px solid #39424c;
    border-radius: 10px;
    & > div:last-of-type {
      display: block;
    }
    .divider {
      margin: 10px 0;
    }
    .avatar-box {
      margin-right: 10px;
      float: left;
    }
    .name-box {
      margin-bottom: 6px;
    }
    .text-box {
      clear: both;
      display: block;
      margin-top: 10px;
    }
  }
`;
const StatusBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 210px;
`;
