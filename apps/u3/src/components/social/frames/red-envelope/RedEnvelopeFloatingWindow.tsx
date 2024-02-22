import { ComponentPropsWithRef, useCallback, useEffect, useState } from 'react';
import { DoubleArrowDownIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import CreateModal from './CreateModal';
import useLogin from '@/hooks/shared/useLogin';
import {
  claimRedEnvelope,
  redEnvelopeClaimCheck,
} from '@/services/social/api/farcaster';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';

export default function RedEnvelopeFloatingWindow() {
  const { claimStatus } = useFarcasterCtx();
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

  const checkCouldClaim = useCallback(async () => {
    if (!isLogin) {
      return;
    }
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
  }, [isLogin]);

  const claimRedEnvelopeAction = useCallback(async () => {
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
  }, [checkCouldClaim, isLogin]);

  useEffect(() => {
    if (mounted) {
      checkCouldClaim();
    }
  }, [mounted, isLogin, checkCouldClaim]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isLogin) {
    return null;
  }

  if (claimStatus.statusCode === 101) {
    return null;
  }

  if (claimed) {
    return (
      <FloatingWindowWrapper>
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

        <CommonButton
          className="w-full"
          onClick={() => {
            setClaimed(false);
          }}
        >
          👏👏👏
        </CommonButton>
        <CreateModal open={open} closeModal={() => setOpen(false)} />
      </FloatingWindowWrapper>
    );
  }

  if (couldClaim) {
    return (
      <FloatingWindowWrapper>
        <div className="text-[#FFF] text-[14px] font-medium">
          🧧 Red Envelope
        </div>
        <div className="text-[#FFF] text-[14px] font-medium">
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
      </FloatingWindowWrapper>
    );
  }

  return (
    <FloatingWindowWrapper>
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
    </FloatingWindowWrapper>
  );
}

function FloatingWindowWrapper({
  children,
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };
  return isExpanded ? (
    <div
      className={cn(
        'fixed bottom-[20px] right-[54px] z-[100]',
        'w-[280px] h-auto flex flex-col items-start gap-[20px] rounded-[20px] bg-[#F41F4C] p-[20px] box-border',
        `transition-[height] duration-500`,
        className
      )}
      {...props}
    >
      <div
        className={cn(
          `
          w-[48px] h-[48px] absolute left-1/2 -translate-x-1/2 -top-[24px] overflow-hidden cursor-pointer bg-[#F41F4C] rounded-full
          text-[#FFF] font-medium flex justify-center items-center`
        )}
        onClick={toggleExpand}
      >
        <DoubleArrowDownIcon />
      </div>
      {children}
    </div>
  ) : (
    <div
      className={cn(
        `fixed bottom-[20px] right-[280px] z-[100] text-[50px] cursor-pointer flex flex-col`
      )}
      onClick={toggleExpand}
    >
      🧧
      {/* <span className="text-[#FFF] font-medium  text-[12px]">Red Envelope</span> */}
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
