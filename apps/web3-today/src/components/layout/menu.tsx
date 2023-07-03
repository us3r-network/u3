/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 21:38:11
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import LoginButton from './LoginButton';
import { ReactComponent as LogoIconSvg } from '../imgs/logo-icon.svg';
import { useAppSelector } from '../../store/hooks';
import { selectKarmaState } from '../../features/profile/karma';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { totalScore } = useAppSelector(selectKarmaState);

  return (
    <MenuWrapper
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      isOpen={isOpen}
    >
      <LogoBox onlyIcon={!isOpen} onClick={() => navigate('/')}>
        <LogoIconBox onlyIcon={!isOpen}>
          <LogoIconSvg />
        </LogoIconBox>

        <LogoText>Alpha</LogoText>
      </LogoBox>
      <LoginButtonBox>
        <LoginButton onlyIcon={!isOpen} karmaScore={totalScore} />
      </LoginButtonBox>
    </MenuWrapper>
  );
}
const MenuWrapper = styled.div<{ isOpen: boolean }>`
  background: #1b1e23;
  width: ${({ isOpen }) => (isOpen ? '180px' : '60px')};
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  padding: 20px 10px;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.3s ease-out;
  display: flex;
  flex-direction: column;
  gap: 20;
  justify-content: space-between;
  align-items: flex-start;
`;
const LogoBox = styled.div<{ onlyIcon?: boolean }>`
  width: ${({ onlyIcon }) => (onlyIcon ? '36px' : '142px')};
  display: flex;
  gap: 10px;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div<{ onlyIcon?: boolean }>`
  width: 36px;
  height: 36px;
  path {
    transition: all 0.3s ease-out;
  }
  ${({ onlyIcon }) =>
    onlyIcon &&
    `path {
      fill: #fff;
    }
  `};
`;
const LogoText = styled.span`
  font-weight: 500;
  font-size: 16px;
  color: #ffffff;
`;
const LoginButtonBox = styled.div`
  width: 100%;
  transition: all 0.3s ease-out;
`;
