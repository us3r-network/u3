import styled from "styled-components";
import FidRegister from "./FidRegister";
import { useAccount } from "wagmi";
import FnameRegister from "./FnameRegister";

export default function Register() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return <RegisterContainer>Connect your wallet first</RegisterContainer>;
  }
  return (
    <RegisterContainer>
      <p>{`Register Farcaster with ${shortPubKey(address!)} `}</p>
      <div>
        <FidRegister />
        <FnameRegister />
      </div>
    </RegisterContainer>
  );
}

export function shortPubKey(key: string, len = 4) {
  return key.slice(0, len + 2) + "..." + key.slice(-len);
}

const RegisterContainer = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  color: #ffffff;

  > div {
    border: 1px solid #39424c;
    border-radius: 10px;
    width: 500px;
    padding: 20px;
    box-sizing: border-box;
  }
`;
