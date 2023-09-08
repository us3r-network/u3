import styled from 'styled-components';
import { useState } from 'react';
import { MessageRoute, useXmtpStore } from '../../contexts/xmtp/XmtpStoreCtx';
import useStartNewConvo from '../../hooks/xmtp/useStartNewConvo';
import InputBase from '../common/input/InputBase';
import { ButtonPrimaryLine } from '../common/button/ButtonBase';

export default function StartNewConversation() {
  const { setMessageRouteParams } = useXmtpStore();
  const { isStarting, startNewConvo } = useStartNewConvo();
  const [errMsg, setErrMsg] = useState('');
  const [convoAddress, setConvoAddress] = useState('');
  return (
    <StartNewConversationWrap
      onSubmit={(e) => {
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
      <StartFormWrap>
        <ConvoAddress
          disabled={isStarting}
          placeholder="Enter address of recipient"
          value={convoAddress}
          onChange={(e) => {
            setConvoAddress(e.target.value);
            setErrMsg('');
          }}
        />
        <SubmitButton type="submit" disabled={isStarting}>
          Start
        </SubmitButton>
      </StartFormWrap>
      {errMsg && <ErrMsg>{errMsg}</ErrMsg>}
    </StartNewConversationWrap>
  );
}
const StartNewConversationWrap = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const StartFormWrap = styled.div`
  display: flex;
  gap: 10px;
`;
const ConvoAddress = styled(InputBase)`
  width: 0;
  flex: 1;
`;
const SubmitButton = styled(ButtonPrimaryLine)`
  height: 40px;
`;
const ErrMsg = styled.p`
  color: red;
`;
