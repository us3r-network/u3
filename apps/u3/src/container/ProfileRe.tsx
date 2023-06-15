import styled from 'styled-components';
import { useState } from 'react';
import { isMobile } from 'react-device-detect';

import LogoutConfirmModal from '../components/layout/LogoutConfirmModal';
import useLogin from '../hooks/useLogin';
import { LogoutButton } from '../components/layout/LoginButton';
import Reviews from '../components/profile/review/Reviews';
import ReviewsMobile from '../components/profile/review/ReviewsMobile';
import UserInfoStyled from '../components/s3/profile/UserInfoStyled';
import UserTagsStyled from '../components/s3/profile/UserTagsStyled';
import UserWalletsStyled from '../components/s3/profile/UserWalletsStyled';

function ProfileInfo() {
  return (
    <ProfileInfoWrap>
      <UserInfoStyled />
      <UserWalletsStyled />
      <UserTagsStyled />
    </ProfileInfoWrap>
  );
}
const ProfileInfoWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export default function ProfileRe() {
  const { logout } = useLogin();
  const [openLogoutConfirm, setOpenLogoutConfirm] = useState(false);

  return (
    <ProfileWrapper>
      {isMobile ? (
        <div className="profile-wrap_mobile">
          <ProfileInfo />
          <ReviewsMobile />
          <LogoutButton
            className="logout-button"
            onClick={() => {
              setOpenLogoutConfirm(true);
            }}
          />
        </div>
      ) : (
        <>
          <div className="profile-wrap">
            <ProfileInfo />
            <LogoutButton
              className="logout-button"
              onClick={() => {
                setOpenLogoutConfirm(true);
              }}
            />
          </div>
          <div className="reviews-warp">
            <Reviews />
          </div>
        </>
      )}

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
    </ProfileWrapper>
  );
}

const ProfileWrapper = styled.div`
  height: 100%;
  overflow: scroll;
  display: flex;
  gap: 40px;
  .profile-wrap {
    padding-top: 40px;
    margin: 0 auto;
    .logout-button {
      margin-top: 20px;
    }
  }

  .reviews-warp {
    padding-top: 40px;
    flex-grow: 1;
  }

  .profile-wrap_mobile {
    width: 100vw;
    padding: 10px;
    & > div:first-of-type {
      width: auto;
      & > div {
        width: auto;
      }
      & > div:nth-of-type(2) {
        background: transparent;
        padding: 0;
        .wallet-item {
          background: #1b1e23;
          border-radius: 20px;
          padding: 11.2px;
        }
      }
      & > div:last-of-type {
        padding: 0;
        background: transparent;
      }
      & > div:first-of-type {
        /* background: red; */
        & > div {
          & > div {
            padding: 10px;
            height: 100px;
            display: block;
            border: 1px solid #39424c;
            border-radius: 10px;
            width: auto;
            /* margin-top: 8px; */
            /* flex-direction: row; */
            .name-box {
              text-align: left;
              margin-top: 15px;
            }
            .avatar-box {
              float: left;
              width: 80px;
              height: 80px;
              margin-right: 10px;
            }
          }
        }
      }
    }
  }
`;
