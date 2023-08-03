import styled from 'styled-components';
import { useState } from 'react';
import { useXmtpConversations } from '../../contexts/XmtpConversationsContext';

export default function StartNewConversation() {
  const { startNewConvo } = useXmtpConversations();
  const [errMsg, setErrMsg] = useState('');
  const [convoAddress, setConvoAddress] = useState('');
  return (
    <StartNewConversationWrap
      onSubmit={(e) => {
        e.preventDefault();
        startNewConvo(convoAddress, {
          onSuccess: () => {
            setConvoAddress('');
          },
          onFail: (error) => {
            setErrMsg(error.message);
          },
        });
      }}
    >
      <div>
        <ConvoAddress
          placeholder="Enter address of recipient"
          value={convoAddress}
          onChange={(e) => {
            setConvoAddress(e.target.value);
            setErrMsg('');
          }}
        />
        <SubmitButton type="submit">Start Convo</SubmitButton>
      </div>
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

const ConvoAddress = styled.input`
  flex: 1;
  height: 40px;
  resize: none;
  padding: 10px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  outline: none;
  &:focus {
    border-color: #000;
  }
`;
const SubmitButton = styled.button`
  height: 40px;
  width: 100px;
  background-color: #000;
  color: #fff;
  border: none;
  outline: none;
  cursor: pointer;
  &:hover {
    background-color: #333;
  }
`;
const ErrMsg = styled.p`
  color: red;
`;
