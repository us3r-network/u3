import styled from 'styled-components';
import { useMemo, useState } from 'react';

import { useFarcasterCtx } from 'src/contexts/FarcasterCtx';

import { SocialButtonPrimary } from './button/SocialButton';
import { Pin } from '../icons/pin';
import { PinRed } from '../icons/pin-red';

export default function PinChannelBtn({
  parent_url,
  border,
}: {
  parent_url: string;
  border?: string;
}) {
  const [loading, setLoading] = useState(false);
  const { joinChannel, userChannels, currFid, unPinChannel } =
    useFarcasterCtx();
  const joined = useMemo(() => {
    const joinItem = userChannels.find((c) => c.parent_url === parent_url);
    return !!joinItem;
  }, [userChannels, parent_url]);

  if (!currFid) return null;
  return (
    <PinUnpinBtn
      border={border}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setLoading(true);
        if (joined) {
          await unPinChannel(parent_url);
        } else {
          await joinChannel(parent_url);
        }
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
        setLoading(false);
      }}
    >
      {loading ? '...' : joined ? <PinRed /> : <Pin />}
    </PinUnpinBtn>
  );
}

const PinUnpinBtn = styled(SocialButtonPrimary)<{ border?: string }>`
  border-radius: 10px;
  border: ${(props) => (props.border ? props.border : '1px solid #39424c')};
  background: #1b1e23;
  width: 40px;
  height: 40px;
  padding: 0;
  color: #fff;
`;
