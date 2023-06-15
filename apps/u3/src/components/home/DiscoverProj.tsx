import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Title from './Title';
import { Subtract } from '../icons/subtract';
import { DappExploreListItemResponse } from '../../services/types/dapp';
import CardBase from '../common/card/CardBase';

export default function DiscoverProj({
  data,
  viewAllAction,
}: {
  data: Array<DappExploreListItemResponse>;
  viewAllAction: () => void;
}) {
  const navigate = useNavigate();
  return (
    <Box>
      <Title text="Popular Dapps" viewAllAction={viewAllAction} />{' '}
      <CardList>
        {data.map((item) => {
          return (
            <Card
              clickAction={() => {
                navigate(`/dapp-store/${item.id}`);
              }}
              key={item.id}
              {...item}
            />
          );
        })}
      </CardList>
    </Box>
  );
}

const Box = styled.div`
  width: 100%;
`;
const CardList = styled(CardBase)`
  margin-top: 20px;
  padding: 0;
`;

function Card({
  name,
  image,
  clickAction,
}: {
  name: string;
  image: string;
  clickAction: () => void;
}) {
  return (
    <CardWrapper>
      <CardBox onClick={clickAction}>
        <img src={image} alt="" />
        <div>
          <div>
            <h3>{name}</h3>
            <span>{/* <Subtract /> */}</span>
          </div>
        </div>
      </CardBox>
    </CardWrapper>
  );
}
const CardWrapper = styled.div`
  cursor: pointer;
  height: 89px;
  padding: 20px;
  border-bottom: 1px solid #39424c;
  box-sizing: border-box;
  overflow: hidden;
  &:last-child {
    border: none;
  }
  &:hover {
    & > * {
      transform: scale(1.05);
    }
  }
`;
const CardBox = styled.div`
  height: 100%;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  & > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  & > div {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    > div {
      display: flex;
      h3 {
        margin: 0;
        font-weight: 500;
        font-size: 16px;
        line-height: 19px;
        margin-right: 5px;
        color: #ffffff;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &:last-child {
        gap: 20px;
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;

        color: #718096;
      }
    }
  }
`;
