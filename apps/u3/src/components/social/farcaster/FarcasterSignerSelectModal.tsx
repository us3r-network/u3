import { useEffect } from 'react';
import styled from 'styled-components';
import CloseIcon from 'src/components/common/icons/CloseIcon';
import FarcasterIcon from 'src/components/common/icons/FarcasterIcon';
import WarpcastIcon from 'src/components/common/icons/warpcast';
import useUserData from 'src/hooks/social/farcaster/useUserData';
import { getDefaultFarcaster } from 'src/utils/social/farcaster/farcaster-default';

import LogoutSvg from '../../common/assets/svgs/logout.svg';
import ModalContainer from '../../common/modal/ModalContainer';
import { ModalTitle } from '../../common/modal/ModalWidgets';

export default function FarcasterSignerSelectModal({
  open,
  closeModal,
  afterCloseAction,
  qrUserData,
  walletUserData,
  confirmAction,
  addAccountAction,
  registerAction,
  walletCheckStatus,
  qrCheckStatus,
  resetAction,
  selectType,
  setSelectType,
  qrFid,
  walletFid,
}: {
  open: boolean;
  closeModal: () => void;
  afterCloseAction: () => void;
  qrUserData: { type: number; value: string }[];
  walletUserData: { type: number; value: string }[];
  confirmAction: (type: string) => void;
  addAccountAction: () => void;
  registerAction: () => void;
  resetAction: () => void;
  walletCheckStatus: string;
  qrCheckStatus: string;
  selectType: string;
  setSelectType: (type: string) => void;
  qrFid?: number;
  walletFid?: number;
}) {
  const defaultFid = getDefaultFarcaster();
  useEffect(() => {
    if (!qrFid && !walletFid) {
      setSelectType('');
      return;
    }
    if (defaultFid === `${qrFid}`) {
      setSelectType('qr');
    }
    if (defaultFid === `${walletFid}`) {
      setSelectType('wallet');
    }
  }, [qrFid, walletFid]);
  return (
    <ModalContainer
      open={open}
      closeModal={closeModal}
      afterCloseAction={afterCloseAction}
    >
      <ModalBody>
        <ModalHeader>
          <ModalTitle>FID Setting</ModalTitle>
          <button type="button" onClick={closeModal}>
            <CloseIcon />
          </button>
        </ModalHeader>

        {(qrCheckStatus === 'valid' || walletCheckStatus === 'valid') && (
          <ModalContent>
            {qrCheckStatus === 'valid' && (
              <UserData
                type={'qr'}
                selectType={selectType}
                userData={qrUserData}
                onSelect={() => {
                  setSelectType('qr');
                }}
                useAction={(type) => {
                  confirmAction(type);
                }}
                resetAction={() => {
                  resetAction();
                  setSelectType('');
                }}
              />
            )}
            {walletCheckStatus === 'valid' && (
              <UserData
                type={'wallet'}
                selectType={selectType}
                userData={walletUserData}
                onSelect={() => {
                  setSelectType('wallet');
                }}
                useAction={(type) => {
                  confirmAction(type);
                }}
                resetAction={() => {
                  resetAction();
                  setSelectType('');
                }}
              />
            )}
          </ModalContent>
        )}
      </ModalBody>
      <Ops>
        {qrCheckStatus !== 'valid' && (
          <div
            onClick={() => {
              addAccountAction();
            }}
          >
            <span>+</span> Add <WarpcastIcon />
            Warpcast account
          </div>
        )}
        {walletCheckStatus !== 'valid' && (
          <div
            onClick={() => {
              registerAction();
            }}
          >
            <span>+</span>
            Signup
          </div>
        )}
      </Ops>
    </ModalContainer>
  );
}

function UserData({
  type,
  selectType,
  userData,
  onSelect,
  useAction,
  resetAction,
}: {
  type: string;
  selectType: string;
  userData: { type: number; value: string }[];
  onSelect?: () => void;
  useAction: (type: string) => void;
  resetAction: () => void;
}) {
  const data = useUserData(userData);
  const selected = type === selectType;
  return (
    <UserDataBox
      onClick={() => {
        onSelect();
        useAction(type);
      }}
      select={selected}
    >
      <div>
        <div className="tint" />
        <div className="pfp">
          <img src={data.pfp} alt="" />
          <div className="icon">
            <FarcasterIcon />
          </div>
        </div>
        <div className="name">
          {data.display}
          <span>{`@${data.userName}`}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          resetAction();
        }}
      >
        <LogoutIconButton src={LogoutSvg} />
      </button>
    </UserDataBox>
  );
}

const LogoutIconButton = styled.img`
  width: 24px;
  height: 24px;
`;
const UserDataBox = styled.div<{ select: boolean }>`
  display: flex;
  /* flex-direction: column; */
  gap: 10px;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  color: #fff;
  box-sizing: border-box;
  > div {
    cursor: pointer;
    display: flex;
    gap: 10px;
    align-items: center;
    .pfp {
      position: relative;
      > img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      .icon {
        position: absolute;
        bottom: 6px;
        left: 2px;
        width: 12px;
        height: 12px;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
    .tint {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: ${(props) => (props.select ? '#00B171' : '#9C9C9C')};
    }

    .name {
      font-size: 16px;
      font-weight: 500;

      span {
        margin-left: 5px;
        color: #718096;
        font-family: Rubik;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
      }
    }
  }
  > button {
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
    justify-self: end;
  }
  button.go {
    background: linear-gradient(85deg, #cd62ff 0%, #62aaff 100%);
    height: 40px;
    width: 40px;
    border-radius: 10px;
    color: #fff;
    font-family: Baloo Bhai 2;
    font-weight: 700;
  }
`;

const ModalBody = styled.div`
  width: 400px;
  /* height: 220px; */
  flex-shrink: 0;

  padding: 30px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 30px;
`;
const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding-bottom: 15px;
  border-bottom: 1px solid #fff;

  h3 {
    padding: 0;
    margin: 0;
  }

  button {
    border: none;
    outline: none;
    background: transparent;
    cursor: pointer;
  }
`;

const ModalContent = styled.div`
  display: flex;
  gap: 20px;
  justify-content: space-between;
  flex-direction: column;
`;

const Ops = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 30px 20px 30px;
  > div {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: start;
    color: #fff;
    gap: 5px;
    color: #fff;
    font-family: Rubik;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
  }
  button {
    width: 140px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 10px;
    background: linear-gradient(85deg, #cd62ff 0%, #62aaff 100%);
    border: none;
    outline: none;

    cursor: pointer;
    color: #000;
    font-family: Baloo Bhai 2;
    font-size: 12px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
  }
`;
