import styled from 'styled-components';
import { Link } from 'react-router-dom';

import FarcasterChannelData from '../../../constants/warpcast.json';

export default function FarcasterChannel({ url }: { url: string }) {
  const channel = FarcasterChannelData.find((c) => c.parent_url === url);

  if (channel) {
    return (
      <ChannelBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link
          to={`/social/channel/${encodeURIComponent(
            channel.name || channel.channel_description
          )}`}
        >
          <span>#</span>
          <img className="channel-img" src={channel.image} alt="" />
          <span>{channel.name || channel.channel_description}</span>
        </Link>
      </ChannelBox>
    );
  }
  console.log('channel not found', channel, url);
  return null;
}

const ChannelBox = styled.div`
  > a {
    color: #fff;
    display: inline-flex;
    width: fit-content;
    align-items: center;
    text-decoration: none;
    gap: 5px;
    .channel-img {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }
    &:hover {
      text-decoration: underline;
    }
  }
`;
