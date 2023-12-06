/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-01 10:27:40
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 13:58:51
 * @FilePath: /u3/apps/u3/src/components/social/PinedChannels.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import { getChannelFromUrl } from 'src/utils/social/farcaster/getChannel';

import PinChannelBtn from './PinChannelBtn';

export default function PinedChannels() {
  const { userChannels, currFid } = useFarcasterCtx();

  if (!currFid) return null;
  return (
    <ContainerBox>
      <h3>Pined trends</h3>
      {userChannels.map(({ parent_url }) => (
        <PinedChannelItem key={parent_url} parent_url={parent_url} />
      ))}
    </ContainerBox>
  );
}

function PinedChannelItem({ parent_url }: { parent_url: string }) {
  const item = getChannelFromUrl(parent_url);
  const navigate = useNavigate();
  return (
    <ItemBox
      onClick={() => {
        navigate(`/social/channel/${item?.channel_id}`);
      }}
    >
      <div>
        <img src={item?.image} alt={item?.name} />
        <div className="name">{item?.name}</div>
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
