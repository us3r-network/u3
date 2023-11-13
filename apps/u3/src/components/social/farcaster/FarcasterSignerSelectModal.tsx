import styled from 'styled-components';
import { useMemo, useState } from 'react';
import { UserDataType } from '@farcaster/hub-web';
import CloseIcon from 'src/components/common/icons/CloseIcon';
import FarcasterIcon from 'src/components/common/icons/FarcasterIcon';

import ModalContainer from '../../common/modal/ModalContainer';
import { ModalTitle } from '../../common/modal/ModalWidgets';

export default function FarcasterSignerSelectModal({
  open,
  closeModal,
  afterCloseAction,
  qrUserData,
  walletUserData,
  confirmAction,
}: {
  open: boolean;
  closeModal: () => void;
  afterCloseAction: () => void;
  qrUserData: { type: number; value: string }[];
  walletUserData: { type: number; value: string }[];
  confirmAction: (type: string) => void;
}) {
  const [selectType, setSelectType] = useState('');

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
          {/* <ModalCloseBtn onClick={closeModal} /> */}
        </ModalHeader>

        <ModalContent>
          <UserData
            type={'qr'}
            selectType={selectType}
            userData={qrUserData}
            onSelect={() => {
              setSelectType('qr');
            }}
          />
          <UserData
            type={'wallet'}
            selectType={selectType}
            userData={walletUserData}
            onSelect={() => {
              setSelectType('wallet');
            }}
          />
        </ModalContent>
      </ModalBody>
      <Ops>
        <button
          type="button"
          onClick={() => {
            if (!selectType) return;
            confirmAction(selectType);
          }}
        >
          Confirm
        </button>
      </Ops>
    </ModalContainer>
  );
}

function UserData({
  type,
  selectType,
  userData,
  onSelect,
}: {
  type: string;
  selectType: string;
  userData: { type: number; value: string }[];
  onSelect?: () => void;
}) {
  const data = useMemo(() => {
    let pfp = '';
    let display = '';
    let bio = '';
    let userName = '';
    let url = '';

    userData.forEach((item) => {
      switch (item.type) {
        case UserDataType.PFP:
          pfp = item.value;
          break;
        case UserDataType.DISPLAY:
          display = item.value;
          break;
        case UserDataType.BIO:
          bio = item.value;
          break;
        case UserDataType.USERNAME:
          userName = item.value;
          break;
        case UserDataType.URL:
          url = item.value;
          break;
        default:
          break;
      }
    });

    return {
      pfp,
      bio,
      userName,
      display,
      url,
    };
  }, [userData]);
  return (
    <UserDataBox onClick={() => onSelect()} select={type === selectType}>
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
    </UserDataBox>
  );
}

const UserDataBox = styled.div<{ select: boolean }>`
  display: flex;
  /* flex-direction: column; */
  gap: 10px;
  align-items: center;
  cursor: pointer;
  color: #fff;
  /* border: ${(props) =>
    props.select ? '1px solid #cd62ff' : '1px solid #1b1e23'}; */
  box-sizing: border-box;

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
  gap: 20px;
  align-items: center;
  justify-content: end;
  padding: 20px;
  > button {
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
