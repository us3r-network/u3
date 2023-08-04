import styled from 'styled-components';
import { useState } from 'react';
import { useXmtpStore } from '../../contexts/XmtpStoreContext';
import useStartNewConvo from '../../hooks/xmtp/useStartNewConvo';
import InputBase from '../common/input/InputBase';
import { ButtonPrimary } from '../common/button/ButtonBase';

export default function StartNewConversation() {
  const { setCurrentConvoAddress } = useXmtpStore();
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
            setCurrentConvoAddress(convoAddress);
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
          Start Convo
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
  padding-right: 10px;
`;
const ConvoAddress = styled(InputBase)`
  width: 0;
  flex: 1;
`;
const SubmitButton = styled(ButtonPrimary)`
  height: 40px;
`;
const ErrMsg = styled.p`
  color: red;
`;
