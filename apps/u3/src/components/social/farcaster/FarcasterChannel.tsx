import { useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { getCommunityPath } from '@/route/path';

export default function FarcasterChannel({
  url,
  isV2Layout,
}: {
  url: string;
  isV2Layout?: boolean;
}) {
  const { farcasterChannels } = useFarcasterCtx();

  const channel = useMemo(() => {
    return farcasterChannels.find((c) => c.parent_url === url);
  }, [farcasterChannels, url]);

  if (channel) {
    if (isV2Layout) {
      return (
        <Link
          to={getCommunityPath(channel.channel_id)}
          className="hover:underline"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <img
            className="w-[16px] h-[16px] rounded-[30px]"
            src={channel.image}
            alt=""
          />
        </Link>
      );
    }
    return (
      <ChannelBox
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Link to={getCommunityPath(channel.channel_id)}>
          <span>#</span>
          <img className="channel-img" src={channel.image} alt="" />
          <span>{channel.name}</span>
        </Link>
      </ChannelBox>
    );
  }
  // console.log('channel not found', channel, url);
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
    font-weight: 700;
    .channel-img {
      width: 16px;
      height: 16px;
      border-radius: 2px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
`;
