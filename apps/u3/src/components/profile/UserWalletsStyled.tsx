import {
  UserWallets,
  UserWalletAddForm,
  UserWalletsProps,
} from '@us3r-network/profile';
import styled from 'styled-components';
import { useState } from 'react';
import { Dialog, Heading, Modal } from 'react-aria-components';
import { toast } from 'react-toastify';
import { InputBaseCss } from '../common/input/InputBase';
import { ButtonPrimaryLineCss } from '../common/button/ButtonBase';
import { Add } from '../common/icons/add';
import { Copy } from '../common/icons/copy';
import { Trash } from '../common/icons/trash';

export default function UserWalletsStyled(props: UserWalletsProps) {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  return (
    <UserWalletsWrapper {...props}>
      {({ isLoginUser }) => {
        return (
          <>
            <div className="header">
              <h3>
                Wallets (<UserWallets.Count />)
              </h3>
              {isLoginUser && (
                <span
                  onClick={() => {
                    setIsOpenEdit(true);
                  }}
                >
                  <Add />
                </span>
              )}
            </div>
            <UserWallets.List>
              {(item) => (
                <UserWallets.Item value={item} key={item.address}>
                  <div className="text">
                    <UserWallets.Address />
                    <UserWallets.Network />
                  </div>
                  <div className="btns">
                    {isLoginUser && (
                      <UserWallets.Delete>
                        <Trash />
                      </UserWallets.Delete>
                    )}
                    <UserWallets.Copy
                      onCopied={() => {
                        toast.success('Copied');
                      }}
                    >
                      <Copy />
                    </UserWallets.Copy>
                  </div>
                </UserWallets.Item>
              )}
            </UserWallets.List>
            {isLoginUser && (
              <Modal
                isDismissable
                isOpen={isOpenEdit}
                onOpenChange={setIsOpenEdit}
              >
                <Dialog>
                  <Heading>Add New Wallet</Heading>
                  <UserWalletAddFormWrapper
                    onSuccessfullySubmit={() => {
                      setIsOpenEdit(false);
                    }}
                  >
                    <UserWalletAddForm.AddressInput />

                    <UserWalletAddForm.SubmitButton>
                      Save
                    </UserWalletAddForm.SubmitButton>

                    <UserWalletAddForm.ErrorMessage />
                  </UserWalletAddFormWrapper>
                </Dialog>
              </Modal>
            )}
          </>
        );
      }}
    </UserWalletsWrapper>
  );
}
const UserWalletsWrapper = styled(UserWallets)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  padding: 20px;
  width: 360px;
  box-sizing: border-box;
  background: #1b1e23;
  border-radius: 20px;
  border: 1px solid #39424c;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > h3 {
      margin: 0;
      font-style: italic;
      font-weight: 700;
      font-size: 24px;
      line-height: 28px;
      display: flex;
      color: #ffffff;
    }

    > span {
      cursor: pointer;
    }
  }

  [data-state-element='List'] {
    width: 100%;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  [data-state-element='Item'] {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .text,
    .btns {
      color: #718096;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    &[data-focused] {
      outline: none;
    }
  }
  [data-state-element='Network'] {
    padding: 2px 4px;
    background: #718096;
    border-radius: 4px;
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
    color: #14171a;
    &:empty {
      display: none;
    }
  }

  [data-state-element='Delete'] {
    cursor: pointer;
  }
  [data-state-element='Copy'] {
    cursor: pointer;
  }
`;

const UserWalletAddFormWrapper = styled(UserWalletAddForm)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 380px;
  [data-state-element='AddressInput'] {
    ${InputBaseCss}
  }
  [data-state-element='SubmitButton'] {
    ${ButtonPrimaryLineCss}
  }
  [data-state-element='ErrorMessage'] {
    color: red;
  }
`;
