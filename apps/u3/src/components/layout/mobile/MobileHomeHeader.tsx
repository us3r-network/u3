/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 15:54:26
 * @Description: file description
 */
import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as LogoIconSvg } from '../../common/assets/imgs/logo-icon.svg';
import LogoutConfirmModal from '../LogoutConfirmModal';
import useLogin from '../../../hooks/shared/useLogin';
import MobileLoginButton from './MobileLoginButton';
import useRoute from '@/route/useRoute';
import SearchIcon from '@/components/common/icons/SearchIcon';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { QuickSearchModalName } from '@/components/social/QuickSearchModal';

export default function MobileHomeHeader() {
  const { logout } = useLogin();
  const navigate = useNavigate();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);
  const { firstRouteMeta } = useRoute();
  const { setOpenModalName } = useFarcasterCtx();
  return (
    <MobileHomeHeaderWrapper>
      <LogoBox onClick={() => navigate('/')}>
        <LogoIconBox>
          <LogoIconSvg />
        </LogoIconBox>

        {/* <LogoText>Alpha</LogoText> */}
      </LogoBox>
      <div className="flex-1 flex justify-between items-center">
        <span className="font-bold text-[20px] leading-[24px] text-[#ffffff]">
          {firstRouteMeta?.title || 'U3.XYZ'}
        </span>
        <SearchIcon onClick={() => setOpenModalName(QuickSearchModalName)} />
      </div>
      <MobileLoginButton
        onLogout={() => {
          setOpenLogoutConfirm(true);
        }}
      />
      <LogoutConfirmModal
        isOpen={openLogoutConfirm}
        onClose={() => {
          setOpenLogoutConfirm(false);
        }}
        onConfirm={() => {
          logout();
          setOpenLogoutConfirm(false);
        }}
      />
    </MobileHomeHeaderWrapper>
  );
}
const MobileHomeHeaderWrapper = styled.div`
  background: #1b1e23;
  width: 100%;
  height: 56px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 20px 10px;
  border-bottom: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  gap: 20px;
  justify-content: space-between;
  align-items: center;
`;
const LogoBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
  overflow: hidden;
  transition: all 0.3s ease-out;
  cursor: pointer;
`;
const LogoIconBox = styled.div`
  path {
    fill: #5057aa;
  }
`;
