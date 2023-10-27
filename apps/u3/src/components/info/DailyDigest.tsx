/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-17 14:50:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-17 15:50:29
 * @Description: file description
 */
import React from 'react';
import styled from 'styled-components';
import { Email } from '../common/icons/email';

const DailyDigestBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
  padding: 20px;
  width: 360px;
  min-width: 360px;
  height: 170px;

  background: #1b1e23;
  border-bottom: 1px solid #14171a;
  border-radius: 20px;
  h2 {
    margin: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 28px;
    font-style: italic;
    color: #ffffff;
  }

  & .desc {
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #718096;
  }

  & button {
    border: none;
    width: 100%;

    isolation: isolate;

    height: 44px;

    background: #5ba85a;
    border-radius: 12px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    text-align: center;

    color: #ffffff;

    & svg {
      vertical-align: middle;
      margin-right: 10px;
    }
  }
`;

export default function DailyDigest() {
  return (
    <DailyDigestBox>
      <h2>Daily Digest</h2>
      <div className="desc">
        Daily recommends everything you are interested web3
      </div>

      <div>
        {/* <button type="button">
          <Email />
          Email
        </button> */}
      </div>
    </DailyDigestBox>
  );
}
