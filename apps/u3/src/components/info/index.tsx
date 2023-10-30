import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import { UserAvatar, UserName } from '@us3r-network/profile';
import { sortPubKey } from '../../utils/shared/solana';
import { Copy } from '../common/icons/copy';

import { Refresh } from '../common/icons/refresh';
import { Edit } from '../common/icons/edit';
import WalletList from './WalletList';
import AddWalletModal from './AddWalletModal';
import { ProfileWallet } from '../../services/profile/types/profile';
import { defaultFormatDate } from '../../utils/shared/time';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { messages } from '../../utils/shared/message';
import {
  selectFrensHandlesState,
  getFollower,
  getFollowing,
} from '../../features/frens/frensHandles';

export default function Info({
  walletAddr,
  date,
  wallets,
  addWallet,
  delWallet,
}: {
  walletAddr: string;
  date: number;
  wallets: ProfileWallet[];
  delWallet: (addr: string) => void;
  addWallet: (addr: string) => Promise<boolean>;
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const dispatch = useAppDispatch();
  const { following, follower } = useAppSelector(selectFrensHandlesState);

  useEffect(() => {
    dispatch(getFollowing({ reset: true }));
    dispatch(getFollower({ reset: true }));
  }, []);

  return (
    <InfoBox>
      <div className="user-info">
        <div className="img-edit">
          <div
            onClick={() => {
              console.log('TODO');
            }}
          >
            <Edit />
          </div>
          <UserAvatar className="user-avatar" />
        </div>

        <div className="info">
          <div className="nickname">
            <div>
              <span className="name">
                <UserName />
              </span>
            </div>
            <div className="wallet">
              <WalletList
                currAddr={walletAddr}
                wallets={[{ wallet: walletAddr, chain: 'eth' }, ...wallets]}
                addAction={() => {
                  setShowAddModal(true);
                }}
                delAction={(addr) => {
                  if (addr === walletAddr) return;
                  delWallet(addr);
                }}
              />
              <span className="share">
                <Refresh />
              </span>
            </div>
          </div>
          <div className="addr">
            <span>{sortPubKey(walletAddr || '', 10)}</span>
            <span
              className="copy"
              onClick={() => {
                navigator.clipboard.writeText(walletAddr).then(
                  () => {
                    toast.success(messages.common.copy);
                  },
                  (err) => {
                    console.error('Async: Could not copy text: ', err);
                  }
                );
              }}
            >
              <Copy />
            </span>
          </div>
          <div className="attach">
            <div>
              <span>
                <span className="num">{following?.total || 0}</span>Following
              </span>
              <span>
                <span className="num">{follower?.total || 0}</span>Follower
              </span>
              <span>|</span>
              <span>{defaultFormatDate(date || Date.now())}</span>
            </div>
          </div>
        </div>
      </div>
      <AddWalletModal
        show={showAddModal}
        closeModal={() => {
          setShowAddModal(false);
        }}
        confirmAction={async (addr) => {
          const r = await addWallet(addr);
          if (r) {
            setShowAddModal(false);
          }
          return r;
        }}
      />
    </InfoBox>
  );
}

const InfoBox = styled.div`
  padding: 25px 25px 25px 20px;
  box-sizing: border-box;
  color: white;
  width: 100%;
  height: 170px;

  background: #1b1e23;
  border-radius: 20px;
  .user-info {
    display: flex;
    gap: 20px;
    & img.user-avatar {
      border-radius: 50%;

      width: 120px;
      height: 120px;
    }
    & > div.img-edit {
      position: relative;
      &:hover {
        > div {
          display: flex;
        }
      }
      > div {
        cursor: pointer;
        position: absolute;
        display: none;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.5)
        );
      }
    }
    & > div.info {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      justify-content: space-between;
      & .nickname {
        display: flex;
        justify-content: space-between;
        & > div {
          &:first-child {
            display: flex;
            gap: 10px;
            align-items: center;
          }
        }

        & .name div {
          font-size: 25px;
          font-weight: 700;
          font-style: italic;
          font-weight: 700;
          font-size: 24px;
          line-height: 28px;

          color: #ffffff;
        }
      }

      & .wallet {
        display: flex;
        gap: 20px;
        & > div {
          margin-top: -8px;
        }
      }
    }

    div.addr {
      display: flex;
      gap: 5px;
      color: #718096;
      align-items: center;
      font-weight: 400;
      font-size: 16px;
      line-height: 24px;
      & .copy {
        cursor: pointer;
      }
    }

    & .share {
      cursor: pointer;
    }
  }

  .attach {
    display: flex;

    justify-content: space-between;
    align-items: center;
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */

    /* #718096 */

    color: #718096;
    > div {
      display: flex;
      gap: 10px;
    }

    & .num {
      line-height: 19px;
      color: #ffffff;
      margin-right: 5px;
    }

    & .twitter,
    & .discord {
      width: 40px;
      height: 40px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #14171a;
    }
    & .discord {
      /* background: #14171a; */
    }
  }
`;
