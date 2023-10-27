import { useNavigate } from 'react-router-dom';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import styled from 'styled-components';
import ChannelItem from './ChannelItem';

export default function TrendChannel() {
  const navigate = useNavigate();
  const { channels } = useFarcasterCtx();
  if (channels.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Header>
        <Title>Trends</Title>
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
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  margin: 0;
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
`;
