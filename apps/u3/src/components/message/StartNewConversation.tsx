import { useState } from 'react';
import {
  MessageRoute,
  useXmtpClient,
} from '../../contexts/message/XmtpClientCtx';
import useStartNewConvo from '../../hooks/message/xmtp/useStartNewConvo';
import ColorButton from '../common/button/ColorButton';
import { Input } from '../ui/input';

export default function StartNewConversation() {
  const { setMessageRouteParams } = useXmtpClient();
  const { isStarting, startNewConvo } = useStartNewConvo();
  const [errMsg, setErrMsg] = useState('');
  const [convoAddress, setConvoAddress] = useState('');
  return (
    <div className="w-full flex flex-col gap-[10px]">
      <div className="flex gap-[10px">
        <Input
          className="text-white"
          disabled={isStarting}
          placeholder="Enter address of recipient"
          value={convoAddress}
          onChange={(e) => {
            setConvoAddress(e.target.value);
            setErrMsg('');
          }}
        />
        <ColorButton
          disabled={!convoAddress || isStarting}
          onClick={(e) => {
            e.preventDefault();
            startNewConvo(convoAddress, {
              onSuccess: () => {
                setConvoAddress('');
                setMessageRouteParams({
                  route: MessageRoute.DETAIL,
                  peerAddress: convoAddress,
                });
              },
              onFail: (error) => {
                setErrMsg(error.message);
              },
            });
          }}
        >
          Start
        </ColorButton>
      </div>
      {errMsg && <p className="text-[red]">{errMsg}</p>}
    </div>
  );
}
