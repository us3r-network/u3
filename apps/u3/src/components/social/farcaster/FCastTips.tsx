import { useCallback, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  prepareWriteContract,
  switchNetwork,
  waitForTransaction,
  writeContract,
} from '@wagmi/core';
import { toast } from 'react-toastify';
import { parseEther } from 'viem';
import { base } from 'viem/chains';

import { UserData } from '@/utils/social/farcaster/user-data';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { cn } from '@/lib/utils';
import useLogin from '@/hooks/shared/useLogin';
import {
  getUserinfoWithFid,
  notifyTipApi,
} from '@/services/social/api/farcaster';
import { shortPubKey } from '@/utils/shared/shortPubKey';
import Loading from '@/components/common/loading/Loading';
import { DegenABI, DegenAddress } from '@/services/social/abi/degen/contract';
import { FarCast } from '@/services/social/types';
import DegenTip from '@/components/common/icons/DegenTip';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function FCastTips({
  userData,
  cast,
}: {
  userData: UserData;
  cast: FarCast;
}) {
  const [openModal, setOpenModal] = useState(false);
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [userinfo, setUserInfo] = useState<{ address: string; fname: string }>({
    address: '',
    fname: '',
  });
  const [loading, setLoading] = useState(false);
  const loadUserinfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getUserinfoWithFid(userData.fid);
      setUserInfo(data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userData]);

  return (
    <>
      <div
        className="flex items-center gap-2 font-[12px] cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (!isLoginU3) {
            loginU3();
            return;
          }
          if (!address) {
            openConnectModal();
            return;
          }
          loadUserinfo();
          setOpenModal(true);
        }}
      >
        <DegenTip className={'w-5 h-5'} />
        <span className="text-[#A36EFD]">Tips</span>
      </div>
      {openModal && (
        <TipsModal
          open={openModal}
          setOpen={setOpenModal}
          loading={loading}
          userinfo={userinfo}
          userData={userData}
          cast={cast}
        />
      )}
    </>
  );
}

function TipsModal({
  open,
  setOpen,
  loading,
  userinfo,
  userData,
  cast,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  userData: UserData;
  userinfo: { address: string; fname: string };
  cast: FarCast;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={() => {
        setOpen(false);
      }}
      contentTop="40%"
      className="w-full md:w-[320px]"
    >
      <div
        className={cn(
          'flex flex-col gap-5 p-5 bg-[#1B1E23] text-white border-[#39424C]',
          'rounded-xl md:rounded-[20px] md:max-w-none md:w-[320px]'
        )}
      >
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between gap-2">
            <div className="text-base">
              <span className="text-[#718096]">Tips</span>
            </div>
            <div
              className="hover:cursor-pointer"
              onClick={() => {
                setOpen(false);
              }}
            >
              <Cross2Icon className="h-5 w-5 text-[#718096]" />
            </div>
          </div>
        </div>

        {(loading && (
          <div className="flex justify-center">
            <Loading />
          </div>
        )) ||
          (userinfo.address && (
            <TipTransaction
              address={userinfo.address}
              fname={userData.userName}
              castHash={Buffer.from(cast.hash.data).toString('hex')}
              successCallback={() => {
                setOpen(false);
              }}
            />
          )) || <div>connot load valid address</div>}
      </div>
    </ModalContainer>
  );
}

function TipTransaction({
  fname,
  address,
  castHash,
  successCallback,
}: {
  fname: string;
  address: string;
  castHash: string;
  successCallback?: () => void;
}) {
  const { currFid } = useFarcasterCtx();
  const tipsCount = [69, 420, 42069];
  const { address: accountAddr } = useAccount();
  const result = useBalance({
    address: accountAddr,
    formatUnits: 'ether',
    token: DegenAddress,
    chainId: base.id,
  });
  const network = useNetwork();
  const [tipAmount, setTipAmount] = useState<number>(tipsCount[1]);
  const [transactionHash, setTransactionHash] = useState('');
  const tipAction = useCallback(async () => {
    const left = result?.data?.formatted?.toString() || '0';
    if (Number(left) < tipAmount) {
      toast.error(`not enough $DEGEN, left: ${left}`);
      return;
    }
    try {
      if (network.chain?.id !== base.id) {
        await switchNetwork({ chainId: base.id });
      }
      const { request: transferDegenRequest } = await prepareWriteContract({
        address: DegenAddress,
        abi: DegenABI,
        chainId: base.id,
        functionName: 'transfer',
        args: [`0x${address}`, parseEther(tipAmount.toString())],
      });
      const degenTxHash = await writeContract(transferDegenRequest);
      const degenTxReceipt = await waitForTransaction({
        hash: degenTxHash.hash,
        chainId: base.id,
      });
      console.log('degenTxReceipt', degenTxReceipt);
      if (degenTxReceipt.status === 'success') {
        setTransactionHash(degenTxHash.hash);
        // notify
        await notifyTipApi({
          fromFid: currFid,
          amount: tipAmount,
          txHash: degenTxHash.hash,
          castHash,
        });
        toast.success('tip success');
        successCallback?.();
      } else {
        console.error('transaction failed', degenTxHash.hash, degenTxReceipt);
        toast.error(`mint action failed: ${degenTxReceipt.status}`);
      }
    } catch (e) {
      toast.error(e.message.split('\n')[0]);
    }
  }, [address, tipAmount, result]);

  return (
    <div className="flex flex-col gap-5">
      {/* <div>$Degen: {result?.data?.formatted?.toString() || '0'}</div> */}
      <div className="flex gap-1 items-center justify-between">
        {tipsCount.map((item) => {
          return (
            <div
              key={item}
              className={cn(
                'border bg-white text-black text-sm text-center rounded-full p-2 min-w-[80px] hover:cursor-pointer',
                tipAmount === item && 'text-[#F41F4C]'
              )}
              onClick={() => {
                setTipAmount(item);
              }}
            >
              {item}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-1">
        <span className="mr-2">or</span>
        <input
          type="number"
          className="w-full border border-[#39424C] rounded-md p-1 px-2 text-white bg-[#1B1E23] outline-none"
          value={tipAmount.toString()}
          onChange={(e) => {
            setTipAmount(Number(e.target.value));
          }}
        />
        <span>$DEGEN</span>
      </div>
      <button
        type="button"
        className="w-full font-bold bg-[#F41F4C] text-white rounded-md p-1 hover:cursor-pointer"
        onClick={tipAction}
      >
        Pay
      </button>
      <p className="text-center text-[#718096]">
        to @{fname} (0x{shortPubKey(address, { len: 4 })})
      </p>
    </div>
  );
}
