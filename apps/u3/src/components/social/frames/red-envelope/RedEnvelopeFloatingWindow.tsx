import { ComponentPropsWithRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateModal from './CreateModal';
import useLogin from '@/hooks/shared/useLogin';
import {
  claimRedEnvelope,
  redEnvelopeClaimCheck,
} from '@/services/social/api/farcaster';

export default function RedEnvelopeFloatingWindow() {
  const { isLogin } = useLogin();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [couldClaim, setCouldClaim] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [unclaimedList, setUnclaimedList] = useState<
    {
      id: number;
      creatorFid: string;
      description: string;
      amount: number;
      status: 'unclaimed';
      createdAt: string;
    }[]
  >([]);
  const [claimedList, setClaimedList] = useState<
    {
      id: number;
      creatorFid: string;
      description: string;
      amount: number;
      status: 'unclaimed';
      createdAt: string;
    }[]
  >([]);

  const checkCouldClaim = async () => {
    // check if user could claim red envelope
    try {
      const resp = await redEnvelopeClaimCheck();
      const { data } = resp;
      console.log('data', data);
      if (data.code === 0 && data.data && data.data.length > 0) {
        setUnclaimedList(data.data);
        setCouldClaim(true);
      } else {
        setCouldClaim(false);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const claimRedEnvelopeAction = async () => {
    // claim red envelope
    try {
      const resp = await claimRedEnvelope();
      const { data } = resp;
      console.log('data', data);
      if (data.code === 0 && data.data && data.data.length > 0) {
        setClaimedList(data.data);
      }
      setClaimed(true);
      await checkCouldClaim();
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (mounted) {
      checkCouldClaim();
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLogin) {
    return null;
  }

  if (claimed) {
    return (
      <div
        className="
      w-[280px] h-auto
      flex flex-col items-start gap-[20px]
      rounded-[20px] bg-[#F41F4C] p-[20px] box-border
      fixed bottom-[20px] right-[54px] z-[100]
      "
      >
        <div className="text-[#FFF] text-[14px] font-medium">
          🧧 Red Envelope
        </div>
        <div className="text-[#FFF] text-[14px] font-medium">
          {claimedList.map((item, index) => {
            return (
              <div key={item.id} className="flex">
                <div>
                  Got {item.amount} $Degen from {item.description}
                </div>
              </div>
            );
          })}
        </div>

        <CommonButton className="w-full">👏👏👏</CommonButton>
        <CreateModal open={open} closeModal={() => setOpen(false)} />
      </div>
    );
  }

  if (couldClaim) {
    return (
      <div
        className="
    w-[280px] h-auto
    flex flex-col items-start gap-[20px]
    rounded-[20px] bg-[#F41F4C] p-[20px] box-border
    fixed bottom-[20px] right-[54px] z-[100]
    "
      >
        <div className="text-[#FFF] text-[14px] font-medium">
          🧧 Red Envelope
        </div>
        <div>
          {unclaimedList.map((item) => {
            return (
              <div key={item.id} className="flex">
                <div>
                  Got {item.amount} $Degen from {item.description}
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-[#FFF] text-[14px] font-medium">
          Click the button below 👇👇👇
        </div>
        <div className="grid grid-cols-2 w-full gap-5">
          <CommonButton
            className="w-full"
            onClick={() => {
              setOpen(true);
            }}
          >
            Create
          </CommonButton>
          <CommonButton
            className="w-full"
            onClick={() => {
              claimRedEnvelopeAction();
            }}
          >
            Claim
          </CommonButton>
        </div>

        <CreateModal open={open} closeModal={() => setOpen(false)} />
      </div>
    );
  }

  return (
    <div
      className="
      w-[280px] h-auto
      flex flex-col items-start gap-[20px]
      rounded-[20px] bg-[#F41F4C] p-[20px] box-border
      fixed bottom-[20px] right-[54px] z-[100]
      "
    >
      <div className="text-[#FFF] text-[14px] font-medium">🧧 Red Envelope</div>
      <CommonButton
        className="w-full"
        onClick={() => {
          setOpen(true);
        }}
      >
        Create My Red Envelope 🧧
      </CommonButton>
      <CreateModal open={open} closeModal={() => setOpen(false)} />
    </div>
  );
}

function CommonButton({
  className,
  ...props
}: ComponentPropsWithRef<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'flex px-[24px] py-[12px] box-border justify-center items-center rounded-[10px] bg-[#FFF]',
        'text-[#14171A] text-center text-[16px] font-medium leading-[24px] whitespace-nowrap',
        className
      )}
      {...props}
    />
  );
}
