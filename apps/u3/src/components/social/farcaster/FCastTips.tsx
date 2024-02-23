/* eslint-disable no-underscore-dangle */
import { useCallback, useEffect, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useAccount, useBalance, useConfig } from 'wagmi';
import { makeCastAdd } from '@farcaster/hub-web';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import {
  simulateContract,
  switchChain,
  waitForTransactionReceipt,
  writeContract,
} from '@wagmi/core';
import { toast } from 'react-toastify';
import { formatUnits, parseEther } from 'viem';
import { base } from 'viem/chains';

import { UserData } from '@/utils/social/farcaster/user-data';
import ModalContainer from '@/components/common/modal/ModalContainer';
import { cn } from '@/lib/utils';
import useLogin from '@/hooks/shared/useLogin';
import {
  getUserDegenTipAllowance,
  getUserinfoWithFid,
  notifyTipApi,
} from '@/services/social/api/farcaster';
import { shortPubKey } from '@/utils/shared/shortPubKey';
import Loading from '@/components/common/loading/Loading';
import { DegenABI, DegenAddress } from '@/services/social/abi/degen/contract';
import { FarCast } from '@/services/social/types';
import DegenTip from '@/components/common/icons/DegenTip';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';
import { Checkbox } from '@/components/ui/checkbox';

export default function FCastTips({
  userData,
  cast,
  updateCb,
}: {
  userData: UserData;
  cast: FarCast;
  updateCb: () => void;
}) {
  const [openModal, setOpenModal] = useState(false);
  const { isLogin: isLoginU3, login: loginU3 } = useLogin();
  const { address } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [userinfo, setUserInfo] = useState<{ address: string; fname: string }>({
    address: '',
    fname: '',
  });
  const { currFid, encryptedSigner } = useFarcasterCtx();
  const [allowance, setAllowance] = useState<string>('0');
  const [remainingAllowance, setRemainingAllowance] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const loadUserinfo = useCallback(async () => {
    try {
      setLoading(true);
      const { data: allowanceData } = await getUserDegenTipAllowance(address);
      const { data } = await getUserinfoWithFid(userData.fid);
      setUserInfo(data.data);
      setAllowance(allowanceData.data?.[0]?.tip_allowance || '0');
      setReplyTipAllowance(allowanceData.data?.[0]?.tip_allowance || '0');
      setRemainingAllowance(
        allowanceData.data?.[0]?.remaining_allowance || '0'
      );
      setReplyTipAmountTotal('0');
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userData, address]);

  const directReply = useCallback(async () => {
    const allowanceValue = getReplyTipAmount();
    try {
      const castToReply = (
        await makeCastAdd(
          {
            text: `${allowanceValue} $DEGEN`,
            embeds: [],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
            parentCastId: {
              hash: Buffer.from(cast.hash.data),
              fid: Number(cast.fid),
            },
          },
          { fid: currFid, network: FARCASTER_NETWORK },
          encryptedSigner
        )
      )._unsafeUnwrap();
      const r = await FARCASTER_WEB_CLIENT.submitMessage(castToReply);
      if (r.isErr()) {
        throw new Error(r.error.message);
      }
      // notify
      cast.tipsTotalAmount =
        (cast.tipsTotalAmount || 0) + Number(allowanceValue);

      setReplyTipAmount(allowanceValue);
      setReplyTipTimes(Number(getReplyTipTimes()) - 1);
      setReplyTipAmountTotal(
        (
          Number(getReplyTipAmountTotal()) + Number(getReplyTipAmount())
        ).toString()
      );
      updateCb();
      toast.success('allowance tip posted');
    } catch (error) {
      console.error(error);
      toast.success('allowance tip failed');
    }
  }, [currFid, encryptedSigner, cast]);

  return (
    <>
      <div
        className="flex items-center gap-2 font-[12px] cursor-pointer whitespace-nowrap"
        onClick={(e) => {
          e.stopPropagation();
          const replyDirect =
            getUseReplyTipDefault() &&
            Number(getReplyTipTimes()) > 0 &&
            Number(getReplyTipAmountTotal()) < Number(getReplyTipAllowance());
          if (!isLoginU3) {
            loginU3();
            return;
          }
          if (!address) {
            openConnectModal();
            return;
          }

          if (replyDirect) {
            directReply();
            return;
          }

          loadUserinfo();
          setOpenModal(true);
        }}
      >
        {/* <DegenTip className={'w-5 h-5'} /> */}
        <span className="text-[#FFBB02]">🎁 Tips</span>
      </div>
      {openModal && (
        <TipsModal
          open={openModal}
          setOpen={setOpenModal}
          loading={loading}
          userinfo={userinfo}
          userData={userData}
          allowance={allowance}
          remainingAllowance={remainingAllowance}
          cast={cast}
          updateCb={updateCb}
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
  allowance,
  remainingAllowance,
  updateCb,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  loading: boolean;
  userData: UserData;
  userinfo: { address: string; fname: string };
  cast: FarCast;
  allowance: string;
  remainingAllowance: string;
  updateCb: () => void;
}) {
  return (
    <ModalContainer
      open={open}
      closeModal={() => {
        setOpen(false);
      }}
      contentTop="40%"
      className="w-full md:w-[400px]"
    >
      <div
        className={cn(
          'flex flex-col gap-5 p-5 bg-[#1B1E23] text-white border-[#39424C]',
          'rounded-xl md:rounded-[20px] md:max-w-none md:w-[400px]'
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
              cast={cast}
              allowance={allowance}
              remainingAllowance={remainingAllowance}
              successCallback={() => {
                setOpen(false);
                updateCb();
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
  cast,
  allowance,
  remainingAllowance,
  successCallback,
}: {
  fname: string;
  address: string;
  cast: FarCast;
  allowance: string;
  remainingAllowance: string;
  successCallback?: () => void;
}) {
  const { currFid, encryptedSigner } = useFarcasterCtx();
  const tipsCount = [69, 420, 42069];
  const { address: accountAddr, chain } = useAccount();
  const config = useConfig();
  const result = useBalance({
    address: accountAddr,
    token: DegenAddress,
    chainId: base.id,
  });
  const [tipAmount, setTipAmount] = useState<number>(tipsCount[1]);
  const [allowanceValue, setAllowanceValue] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [tab, setTab] = useState('TabReply');
  const [count, setCount] = useState(0);

  const tipAction = useCallback(async () => {
    const left =
      formatUnits(result.data.value, result.data.decimals)?.toString() || '0';
    if (Number(left) < tipAmount) {
      toast.error(`not enough $DEGEN, left: ${left}`);
      return;
    }
    try {
      if (chain?.id !== base.id) {
        await switchChain(config, { chainId: base.id });
      }
      const { request: transferDegenRequest } = await simulateContract(config, {
        address: DegenAddress,
        abi: DegenABI,
        chainId: base.id,
        functionName: 'transfer',
        args: [`0x${address}`, parseEther(tipAmount.toString())],
      });
      const degenTxHash = await writeContract(config, transferDegenRequest);
      const degenTxReceipt = await waitForTransactionReceipt(config, {
        hash: degenTxHash,
        chainId: base.id,
      });
      const castHash = Buffer.from(cast.hash.data).toString('hex');
      console.log('degenTxReceipt', degenTxReceipt);
      if (degenTxReceipt.status === 'success') {
        setTransactionHash(degenTxHash);
        // notify
        await notifyTipApi({
          fromFid: currFid,
          amount: tipAmount,
          txHash: degenTxHash,
          type: 'Token',
          castHash,
        });
        cast.tipsTotalAmount = (cast.tipsTotalAmount || 0) + tipAmount;
        toast.success('tip success');
        successCallback?.();
      } else {
        console.error('transaction failed', degenTxHash, degenTxReceipt);
        toast.error(`mint action failed: ${degenTxReceipt.status}`);
      }
    } catch (e) {
      toast.error(e.message.split('\n')[0]);
    }
  }, [address, tipAmount, result, cast]);

  const allowanceAction = useCallback(async () => {
    if (
      Number.isNaN(Number(allowanceValue)) ||
      Number.isNaN(Number(allowance)) ||
      Number(allowanceValue) > Number(allowance)
    ) {
      toast.error('not enough allowance');
      return;
    }
    try {
      const castToReply = (
        await makeCastAdd(
          {
            text: `${allowanceValue} $DEGEN`,
            embeds: [],
            embedsDeprecated: [],
            mentions: [],
            mentionsPositions: [],
            parentCastId: {
              hash: Buffer.from(cast.hash.data),
              fid: Number(cast.fid),
            },
            // parentUrl,
          },
          { fid: currFid, network: FARCASTER_NETWORK },
          encryptedSigner
        )
      )._unsafeUnwrap();
      const r = await FARCASTER_WEB_CLIENT.submitMessage(castToReply);
      if (r.isErr()) {
        throw new Error(r.error.message);
      }
      cast.tipsTotalAmount =
        (cast.tipsTotalAmount || 0) + Number(allowanceValue);
      await notifyTipApi({
        fromFid: currFid,
        amount: Number(allowanceValue),
        txHash: '',
        type: 'Allowance',
        castHash: Buffer.from(cast.hash.data).toString('hex'),
      });
      setReplyTipAmount(allowanceValue);
      setReplyTipAmountTotal(allowanceValue);
      setReplyTipTimes(5);
      toast.success('allowance tip posted');
      successCallback?.();
    } catch (error) {
      console.error(error);
      toast.error('allowance tip failed');
    }
  }, [allowanceValue, currFid, encryptedSigner, allowance]);

  useEffect(() => {
    if (Number(remainingAllowance) > 0) {
      setTab('TabReply');
    }
  }, [remainingAllowance]);

  const useAllowance = getUseReplyTipDefault();

  const remainingAllowanceNum = Number.isNaN(Number(remainingAllowance))
    ? 0
    : Number(remainingAllowance);

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => {
        if (v === 'TabTransaction') {
          localStorage.setItem('tipTab', 'TabTransaction');
        }
        setTab(v);
      }}
      className="h-60"
    >
      <TabsList className="flex gap-5 justify-start w-full mb-7 bg-inherit">
        <TabsTrigger
          value="TabReply"
          className={cn(
            'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
          )}
        >
          Allowance
        </TabsTrigger>
        <TabsTrigger
          value="TabTransaction"
          className={cn(
            'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit data-[state=active]:text-white data-[state=active]:border-white'
          )}
        >
          Token
        </TabsTrigger>
      </TabsList>
      <TabsContent value="TabReply">
        <div className="flex flex-col gap-5">
          <div className="flex gap-1 items-center justify-between">
            {tipsCount.map((item) => {
              const isAllowance = remainingAllowanceNum >= item;
              return (
                <div
                  key={item}
                  className={cn(
                    'border bg-white text-black text-sm text-center rounded-full p-2 min-w-[100px]',
                    allowanceValue === `${item}` && 'text-[#F41F4C]',
                    (!isAllowance && 'cursor-not-allowed opacity-70') ||
                      'hover:cursor-pointer'
                  )}
                  onClick={() => {
                    if (isAllowance) setAllowanceValue(`${item}`);
                  }}
                >
                  ${item}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2">or</span>
            <div className="flex flex-grow items-center border border-[#39424C] rounded-full px-3">
              <input
                type="number"
                className="w-full p-1 px-2 text-white bg-[#1B1E23] outline-none"
                placeholder={`Remaining ${remainingAllowanceNum}, Total ${allowance}`}
                value={allowanceValue}
                onChange={(e) => {
                  setAllowanceValue(e.target.value);
                }}
              />
              <span>$DEGEN</span>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="w-full font-bold bg-[#F41F4C] text-white rounded-md p-1 hover:cursor-pointer"
              onClick={() => {
                allowanceAction();
              }}
            >
              Tip by Reply & Upvote
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="tip-reply-default"
              className="border border-white"
              checked={useAllowance}
              onCheckedChange={(v) => {
                if (allowanceValue === '') {
                  toast.error('Please select an amount');
                  return;
                }
                if (remainingAllowanceNum < Number(allowanceValue) * 5) {
                  toast.error('You have used up the default allowance');
                  return;
                }
                if (v) {
                  setUseReplyTipDefault();
                } else {
                  setUseReplyTipDefault('false');
                }
                setCount(Number(count) + 1);
              }}
            />
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Use as default for next 5 tips
            </p>
          </div>
        </div>
      </TabsContent>
      <TabsContent value="TabTransaction">
        <div className="flex flex-col gap-5">
          <div className="flex gap-1 items-center justify-between">
            {tipsCount.map((item) => {
              return (
                <div
                  key={item}
                  className={cn(
                    'border bg-white text-black text-sm text-center rounded-full p-2 min-w-[100px] hover:cursor-pointer',
                    tipAmount === item && 'text-[#F41F4C]'
                  )}
                  onClick={() => {
                    setTipAmount(item);
                  }}
                >
                  ${item}
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-1">
            <span className="mr-2">or</span>
            <div className="flex flex-grow items-center border border-[#39424C] rounded-full px-3">
              <input
                type="number"
                className="w-full p-1 px-2 text-white bg-[#1B1E23] outline-none"
                value={tipAmount.toString()}
                onChange={(e) => {
                  setTipAmount(Number(e.target.value));
                }}
              />
              <span>$DEGEN</span>
            </div>
          </div>
          <div>
            <button
              type="button"
              className="w-full font-bold bg-[#F41F4C] text-white rounded-md p-1 hover:cursor-pointer"
              onClick={tipAction}
            >
              Pay & Upvote
            </button>
          </div>
          <div className=" text-[#718096]">
            <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              to @{fname} (0x{shortPubKey(address, { len: 4 })})
            </p>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function setReplyTipAllowance(allowance: string) {
  localStorage.setItem('tipAllowance', allowance);
}

function getReplyTipAllowance() {
  return localStorage.getItem('tipAllowance') || '0';
}

function setReplyTipAmount(num: string) {
  localStorage.setItem('tipReplyAmount', num);
}

function setReplyTipAmountTotal(num: string) {
  localStorage.setItem('tipReplyAmountTotal', num);
}

function getReplyTipAmountTotal() {
  return localStorage.getItem('tipReplyAmountTotal') || '0';
}

function getReplyTipAmount() {
  return localStorage.getItem('tipReplyAmount') || '0';
}

function setReplyTipTimes(times: number) {
  localStorage.setItem('tipReplyTimes', times.toString());
}

function getReplyTipTimes() {
  return localStorage.getItem('tipReplyTimes') || '0';
}

function setUseReplyTipDefault(value: string = 'true') {
  localStorage.setItem('useReplyTipDefault', value);
}

function getUseReplyTipDefault() {
  return localStorage.getItem('useReplyTipDefault') === 'true';
}
