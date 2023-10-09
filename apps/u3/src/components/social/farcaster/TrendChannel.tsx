import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFarcasterChannelTrends } from 'src/api/farcaster';
import styled from 'styled-components';

import FarcasterChannelData from '../../../constants/warpcast.json';

export default function TrendChannel() {
  const [trendChannel, setTrendChannel] = useState<
    {
      parent_url: string;
      count: string;
    }[]
  >([]);
  const loadTrendChannel = async () => {
    const resp = await getFarcasterChannelTrends();
    if (resp.data.code !== 0) {
      console.error(resp.data.msg);
      return;
    }
    setTrendChannel(resp.data.data);
  };
  useEffect(() => {
    loadTrendChannel();
  }, []);

  const channels = useMemo(() => {
    return FarcasterChannelData.map((c) => {
      const trend = trendChannel.find((t) => t.parent_url === c.parent_url);
      if (!trend) return null;
      return {
        ...trend,
        ...c,
      };
    })
      .filter((c) => c !== null)
      .sort((a, b) => {
        return Number(b.count) - Number(a.count);
      });
  }, [trendChannel]);

  if (trendChannel.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      <Title>Trending Channels</Title>
      <ChannelListWrapper>
        {channels.map((item) => {
          return <ChannelItem key={item.channel_id} data={item} />;
        })}
      </ChannelListWrapper>
    </Wrapper>
  );
}

function ChannelItem({
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
      <img src={data.image} alt="" />
      <NameWrapper>
        <NameText>{data.name || data.channel_description}</NameText>
        <HandleText>{`${data.count} posts today`}</HandleText>
      </NameWrapper>
    </ItemWrapper>
  );
}

const ItemWrapper = styled(Link)`
  /* width: 100%; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 20px;
  text-decoration: none;
  > img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const NameWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const NameText = styled.div`
  font-size: 16px;
  color: white;
  font-style: normal;
  font-weight: 700;
  line-height: 0;
`;
const HandleText = styled.div`
  font-size: 12px;
  color: grey;
  font-style: normal;
  font-weight: 500;
  line-height: 0;
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
  > :not(:first-child) {
    border-top: 1px solid #718096;
  }
`;
