import styled from 'styled-components';

import FarcasterChannelData from '../../../constants/warpcast.json';

export default function FarcasterChannel({ url }: { url: string }) {
  const channel = FarcasterChannelData.find((c) => c.parent_url === url);
  if (!channel.name && !channel.channel_description) {
    console.log('channel not found', channel);
  }
  if (channel) {
    return (
      <ChannelBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <span>#</span>
        <img className="channel-img" src={channel.image} alt="" />
        <span>{channel.name || channel.channel_description}</span>
      </ChannelBox>
    );
  }
  return null;
}

const ChannelBox = styled.div`
  color: #fff;
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  .channel-img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  &:hover {
    text-decoration: underline;
  }
`;
