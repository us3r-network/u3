import { ConnectKitButton } from "connectkit";
import styled from "styled-components";

export default function Header() {
  return (
    <HeaderContainer>
      <div className="left">
        <h2>U3</h2>
        <span>Farcaster</span>
      </div>
      <div>
        <ConnectKitButton />
      </div>
    </HeaderContainer>
  );
}

const HeaderContainer = styled.header`
  box-sizing: border-box;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 40px;
  z-index: 100;
  position: fixed;
  /* width: 1440px; */
  height: 60px;
  left: 0px;
  right: 0px;
  top: 0px;

  background: #1b1e23;
  border-bottom: 1px solid #39424c;

  .left {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    color: #ffffff;
    a {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
    }

    h2 {
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      text-align: center;
    }
  }
`;
