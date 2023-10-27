import styled from 'styled-components';
import { useMemo, useState } from 'react';

import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';

import { SocialButtonPrimary } from './button/SocialButton';
import { Pin } from '../common/icons/pin';
import { PinRed } from '../common/icons/pin-red';

export default function PinChannelBtn({
  parent_url,
  bg,
}: {
  parent_url: string;
  bg?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { joinChannel, userChannels, currFid } = useFarcasterCtx();
  const joined = useMemo(() => {
    const joinItem = userChannels.find((c) => c.parent_url === parent_url);
    return !!joinItem;
  }, [userChannels, parent_url]);

  if (!currFid) return null;
  return (
    <JoinBtn
      bg={bg}
      onClick={async (e) => {
        e.preventDefault();
        if (joined) return;
        setLoading(true);
        await joinChannel(parent_url);
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        setLoading(false);
      }}
    >
      {loading ? '...' : joined ? <PinRed /> : <Pin />}
    </JoinBtn>
  );
}

const JoinBtn = styled(SocialButtonPrimary)<{ bg?: string }>`
  border-radius: 10px;
  border: 1px solid #39424c;
  background: #1b1e23;
  width: 40px;
  height: 40px;
  padding: 0;
  color: #fff;
`;
