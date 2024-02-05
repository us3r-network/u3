import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useCallback } from 'react';

import useLogin from '@/hooks/shared/useLogin';
import { cn } from '@/lib/utils';
import Checked from '../common/icons/checked';
import Unchecked from '../common/icons/unchecked';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { claimRewardApi } from '@/services/social/api/farcaster';

export default function ClaimOnboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isLogin, login } = useLogin();
  const navigate = useNavigate();
  const {
    isConnected,
    currFid,
    claimStatus,
    setClaimStatus,
    setSignerSelectModalOpen,
  } = useFarcasterCtx();
  const { address } = useAccount();

  const claimAction = useCallback(async () => {
    if (claimStatus.claimed) {
      navigate('/');
      return;
    }
    try {
      await claimRewardApi();
      setClaimStatus({ claimed: true, amount: 0 });
      navigate('/');
    } catch (e) {
      console.error(e);
    }
    navigate('/');
  }, [currFid, claimStatus, navigate]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full md:w-[840px] text-white">
        <div className="flex items-center justify-center mb-7 md:mb-0">
          <span className="hidden md:inline-block text-[80px]">🎉</span>
          <div className="text-center mx-6 ">
            <div className="text-[24px] md:text-[40px] italic flex items-center gap-2 justify-center mb-5 md:mb-0">
              <span className="md:hidden">🎉</span>
              Welcome to u3.xyz
              <span className="md:hidden  -rotate-90">🎉</span>
            </div>
            <p className="text-[#718096]">
              Complete these simple steps to start playing in u3 and get
              rewards!
            </p>
          </div>
          <span className="hidden md:inline-block text-[80px] -rotate-90">
            🎉
          </span>
        </div>
        <div
          className={cn(
            ' border rounded-2xl border-[#39424C]',
            'p-5 flex flex-col gap-8 text-white',
            'm-2 md:w-full'
          )}
        >
          <div className="flex items-center justify-between pb-7 border-b border-[#39424C]">
            <div className="text-[#718096]">Getting started</div>
            <div>3 steps left</div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 italic text-xl">
                {isLogin && address ? <Checked /> : <Unchecked />}
                <span className="text-[#F41F4C] font-bold text-2xl md:text-3xl">
                  Step 1
                </span>
                <span className="hidden md:inline-block">Connect Wallet</span>
              </div>
              <button
                type="button"
                className="w-[120px] font-bold bg-white p-3 px-6 text-black rounded-xl"
                onClick={() => {
                  if (!isLogin || !address) {
                    login();
                  }
                }}
              >
                Connect
              </button>
            </div>
            <span className="md:hidden font-bold text-base">
              Connect Wallet
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 italic text-xl">
                {isConnected && currFid ? <Checked /> : <Unchecked />}
                <span className="text-[#F41F4C] font-bold text-2xl md:text-3xl">
                  Step 2
                </span>
                <span className="hidden md:inline-block">
                  Farcaster Handle Verify
                </span>
              </div>
              <button
                type="button"
                className="w-[120px] font-bold bg-white p-3 px-6 text-black rounded-xl"
                onClick={() => {
                  if (!currFid || !isConnected) setSignerSelectModalOpen(true);
                }}
              >
                Verify
              </button>
            </div>
            <span className="md:hidden font-bold text-base">
              Farcaster Handle Verify
            </span>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 italic text-xl">
                {(isLogin && currFid && isConnected && claimStatus.claimed && (
                  <Checked />
                )) || <Unchecked />}
                <span className="text-[#F41F4C] font-bold text-2xl md:text-3xl">
                  Step 3
                </span>
                <span className="hidden md:inline-block">
                  Get 💰💰💰100 $DEGEN
                </span>
              </div>
              <button
                type="button"
                className="w-[120px] font-bold bg-white p-3 px-6 text-black rounded-xl"
                onClick={claimAction}
              >
                Claim
              </button>
            </div>
            <span className="md:hidden font-bold text-base">
              Get 💰💰💰100 $DEGEN
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
