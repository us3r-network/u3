/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-11-24 18:31:36
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 13:59:31
 * @FilePath: /u3/apps/u3/src/components/social/farcaster/TrendChannel.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useNavigate } from 'react-router-dom';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';

export default function TrendChannel() {
  const navigate = useNavigate();
  const { trendChannels: channels } = useFarcasterCtx();

  if (channels.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Header>
        <Title>Topics</Title>
        <MoreButton
          onClick={() => {
            navigate(`/social/trends`);
          }}
        >
          View All
        </MoreButton>
      </Header>
      <ChannelListWrapper>
        {channels.slice(0, 5).map((item) => {
          return <ChannelItem key={item.channel_id} data={item} />;
        })}
      </ChannelListWrapper>
    </Wrapper>
  );
}

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const MoreButton = styled.button`
  cursor: pointer;
  color: #718096;
  font-size: 16px;
  font-weight: 500;
  border: none;
  outline: none;
  background: inherit;
`;

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
`;
const Title = styled.h1`
  color: #718096;
  font-family: Rubik;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const ChannelListWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  border: 1px solid #39424c;
  border-radius: 20px;
  background-color: #212228;
  > :not(:first-child) {
    border-top: 1px solid #39424c;
  }
`;
