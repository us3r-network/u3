import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';

import PinChannelBtn from './PinChannelBtn';

export default function PinedChannels() {
  const { userChannels, currFid } = useFarcasterCtx();

  if (!currFid) return null;
  return (
    <ContainerBox>
      <h3>Pined topics</h3>
      {userChannels.map(({ parent_url }) => (
        <PinedChannelItem key={parent_url} parent_url={parent_url} />
      ))}
    </ContainerBox>
  );
}

function PinedChannelItem({ parent_url }: { parent_url: string }) {
  const { getChannelFromUrl } = useFarcasterCtx();
  const navigate = useNavigate();

  const item = useMemo(() => {
    return getChannelFromUrl(parent_url);
  }, [parent_url, getChannelFromUrl]);

  if (!item) return null;

  return (
    <ItemBox
      onClick={() => {
        navigate(`/social/channel/${item.channel_id}`);
      }}
    >
      <div>
        <img src={item.image} alt={item.name} />
        <div className="name">{item.name}</div>
      </div>
      <PinChannelBtn parent_url={item.parent_url} />
    </ItemBox>
  );
}

const ItemBox = styled.div`
  height: 60px;
  flex-shrink: 0;
  border-radius: 20px;
  background: #1b1e23;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 10px 20px 20px;
  box-sizing: border-box;
  cursor: pointer;

  > div {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  img {
    width: 20px;
    height: 20px;
  }

  div.name {
    color: #fff;
    font-family: Rubik;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  span {
    cursor: pointer;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ContainerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  > h3 {
    margin: 0;
    margin-bottom: 10px;
    color: #718096;
    font-family: Rubik;
    font-size: 20px;
    font-weight: 600;
  }
`;
