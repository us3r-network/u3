import ChannelItem from 'src/components/social/farcaster/ChannelItem';
import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';
import styled from 'styled-components';

export default function SocialTrends() {
  const { channels } = useFarcasterCtx();
  if (channels.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <ChannelListWrapper>
        {channels.map((item) => {
          return <ChannelItem key={item.channel_id} data={item} />;
        })}
      </ChannelListWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-sizing: border-box;
`;

const ChannelListWrapper = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  /* gap: 20px; */
  border: 1px solid #718096;
  border-radius: 20px;
  background-color: #212228;
  > :not(:first-child) {
    border-top: 1px solid #718096;
  }
`;
