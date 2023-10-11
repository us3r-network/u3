import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function ChannelItem({
  data,
}: {
  data: {
    name?: string;
    channel_description?: string;
    parent_url: string;
    image: string;
    channel_id: string;
    count: string;
  };
}) {
  return (
    <ItemWrapper
      to={`/social/channel/${encodeURIComponent(
        data.name || data.channel_description
      )}`}
    >
      <NameWrapper>
        <span>#</span>
        <img src={data.image} alt="" />
        <NameText>{data.name || data.channel_description}</NameText>
      </NameWrapper>
      <HandleText>{`${data.count} posts today`}</HandleText>
    </ItemWrapper>
  );
}

const ItemWrapper = styled(Link)`
  /* width: 100%; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;
  padding: 20px;
  text-decoration: none;
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
