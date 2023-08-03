import styled from 'styled-components';
import { useState } from 'react';
import { useXmtpConversations } from '../../contexts/XmtpConversationsContext';

export default function SendMessageForm() {
  const { selectedConvoAddress, sendMessage } = useXmtpConversations();
  const [message, setMessage] = useState('');
  return (
    <SendMessageFormWrap
      onSubmit={(e) => {
        e.preventDefault();
        if (!selectedConvoAddress) return;
        sendMessage(selectedConvoAddress, message);
        setMessage('');
      }}
    >
      <TextArea value={message} onChange={(e) => setMessage(e.target.value)} />
      <SubmitButton type="submit">Send</SubmitButton>
    </SendMessageFormWrap>
  );
}
const SendMessageFormWrap = styled.form`
  width: 100%;
  display: flex;
  align-items: center;
`;

const TextArea = styled.textarea`
  flex: 1;
  height: 60px;
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
  height: 60px;
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
