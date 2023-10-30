/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-17 14:50:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 15:39:15
 * @Description: file description
 */
import styled from 'styled-components';
import { Discord } from '../common/icons/discord';
import { Twitter } from '../common/icons/twitter';

export default function OffChainInterest() {
  return (
    <ContentBox>
      <h2>Coming soon</h2>
      <p>
        Filter the Projects you follow based on your Twitter following and
        Discord server.
      </p>
      <p> You can start by authorizing a Twitter and Discord account.</p>
      <div className="btns">
        {/* <BindWithAuthorizerButton authorizerType={AuthorizerType.TWITTER} />
        <BindWithAuthorizerButton authorizerType={AuthorizerType.DISCORD} /> */}
        {/* <button type="button" className="twitter">
          <Twitter />
          Twitter
        </button>
        <button type="button" className="discord">
          <Discord /> Discord
        </button> */}
      </div>
    </ContentBox>
  );
}

const ContentBox = styled.div`
  margin-top: 40px;
  padding: 40px 20px;
  box-sizing: border-box;
  gap: 20px;

  height: 230px;

  background: #1b1e23;
  border-radius: 20px;

  & h2 {
    margin: 0;
    font-style: italic;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    text-align: center;
    color: #ffffff;
    margin-bottom: 20px;
  }

  & p {
    text-align: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #748094;
    margin: 2px;
  }

  & > div.btns {
    margin-top: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 40px;

    & button {
      padding: 10px 16px;
      isolation: isolate;
      border: none;
      width: 240px;
      height: 44px;

      border-radius: 12px;
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      text-align: center;
      color: #ffffff;
      & svg {
        vertical-align: middle;
        margin-right: 8px;
      }
    }
    & button.twitter {
      background: #4097ff;
    }
    & button.discord {
      background: #4f40ff;
    }
  }
`;
