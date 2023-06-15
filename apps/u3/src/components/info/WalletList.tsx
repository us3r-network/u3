import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { sortPubKey } from '../../utils/solana';
import Badge from '../contents/Badge';
import { Add } from '../icons/add';
import { ChevronDown } from '../icons/chevron-down';
import { Copy2 } from '../icons/copy';
import { Trash } from '../icons/trash';
import { Wallet } from '../icons/wallet';
import { ProfileWallet } from '../../services/types/profile';
import { messages } from '../../utils/message';

export default function WalletList({
  wallets,
  currAddr,
  addAction,
  delAction,
}: {
  wallets: ProfileWallet[];
  currAddr: string;
  addAction: () => void;
  delAction: (addr: string) => void;
}) {
  const titleRef = useRef();
  const [showList, setShowList] = useState(false);
  useEffect(() => {
    const windowClick = (e: MouseEvent) => {
      if (
        e.target === titleRef.current ||
        (e.target as HTMLElement).parentNode === titleRef.current
      )
        return;
      setShowList(false);
    };
    window.addEventListener('click', windowClick);
    return () => {
      window.removeEventListener('click', windowClick);
    };
  }, []);
  return (
    <WalletBox>
      <div
        className="title"
        ref={titleRef}
        onClick={() => {
          setShowList(!showList);
        }}
      >
        <span>
          <Wallet />
        </span>
        <span>{wallets.length} Wallet</span>
        <span className={showList ? 'show' : ''}>
          <ChevronDown />
        </span>
      </div>
      {showList && (
        <div
          className="list"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="add">
            <h3>My Wallets</h3>
            <span onClick={addAction}>
              <Add />
            </span>
          </div>
          {wallets.map((item) => {
            const { wallet } = item;
            return (
              <div className="item" key={wallet}>
                <div>
                  <span className="wallet-addr">{sortPubKey(wallet, 4)}</span>
                  {currAddr === wallet && <Badge text="Owner" />}
                </div>

                <div>
                  <span
                    onClick={() => {
                      navigator.clipboard.writeText(wallet).then(
                        () => {
                          toast.success(messages.common.copy);
                        },
                        (err) => {
                          console.error('Async: Could not copy text: ', err);
                        }
                      );
                    }}
                  >
                    <Copy2 />
                  </span>
                  {currAddr !== wallet && (
                    <span
                      onClick={() => {
                        delAction(wallet);
                      }}
                    >
                      <Trash />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </WalletBox>
  );
}

const WalletBox = styled.div`
  position: relative;
  > div.title {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 8px 20px 8px 16px;
    justify-content: center;
    box-sizing: border-box;
    gap: 8px;
    min-width: 150px;
    height: 36px;
    background: #1a1e23;
    border: 1px solid #39424c;
    border-radius: 100px;

    > span {
      & svg {
        vertical-align: middle;
      }
      &.show {
        transform: rotate(180deg);
      }
    }
  }

  > div.list {
    position: absolute;
    padding: 0px;
    top: 45px;
    position: absolute;
    width: 260px;

    background: #1b1e23;
    border: 1px solid #39424c;
    border-radius: 10px;

    > div {
      box-sizing: border-box;
      padding: 20px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    > div.add {
      border-bottom: 1px solid #39424c;
      & span {
        cursor: pointer;
      }
    }

    > div.item {
      > div {
        display: flex;
        gap: 10px;

        > span {
          cursor: pointer;
        }
      }

      & .wallet-addr {
        font-weight: 400;
        font-size: 16px;
        line-height: 19px;

        color: #718096;
      }
    }
  }
`;
