import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PinChannelBtn from '../PinChannelBtn';
import { FarcasterChannel } from '@/hooks/social/farcaster/useFarcasterChannel';

export default function ChannelItem({ data }: { data: FarcasterChannel }) {
  return (
    <ItemWrapper>
      <LeftWrapper to={`/social/channel/${data.channel_id}`}>
        <NameWrapper>
          <span>#</span>
          <img src={data.image} alt="" />
          <NameText>{data.name}</NameText>
        </NameWrapper>
        <HandleText>{`${data.count || 0} posts today`}</HandleText>
      </LeftWrapper>
      <PinChannelBtn parent_url={data.parent_url} />
    </ItemWrapper>
  );
}

const ItemWrapper = styled.div`
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  text-decoration: none;
`;
const LeftWrapper = styled(Link)`
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;
  text-decoration: none;
  flex-grow: 1;
`;
const NameWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  font-weight: 700;
  > span {
    color: #fff;
  }
  img {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    object-fit: cover;
  }
`;
const NameText = styled.div`
  font-size: 16px;
  color: white;
  font-style: normal;
  font-weight: 700;
`;
const HandleText = styled.div`
  font-size: 12px;
  color: grey;
  font-style: normal;
  font-weight: 500;
`;
