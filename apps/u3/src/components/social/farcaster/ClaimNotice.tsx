import { Cross2Icon } from '@radix-ui/react-icons';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { cn } from '@/lib/utils';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import useLogin from '@/hooks/shared/useLogin';

export default function ClaimNotice() {
  const { isLogin } = useLogin();
  const { isConnected, currFid, claimStatus } = useFarcasterCtx();
  const [show, setShow] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();
  const claim = searchParams.get('claim');

  if (claim === 'true' || !isConnected || !currFid || !isLogin) {
    return null;
  }

  if (!show) return null;

  if (claimStatus.statusCode !== 101) return null;

  return (
    <div
      className={cn(
        'absolute z-50 m-auto left-0 right-0',
        'md:right-14 md:left-auto bottom-8 bg-[#F41F4C] w-[320px] p-5 rounded-[20px] text-white',
        'flex flex-col gap-5'
      )}
    >
      <div className="flex items-center justify-between">
        <div> ⚠️ Notice</div>
        <button
          type="button"
          className="p-1"
          onClick={() => {
            setShow(false);
          }}
        >
          <Cross2Icon className="w-5 h-5" />
        </button>
      </div>
      <div>
        💰💰💰You have <span className="font-bold">{claimStatus.amount}</span>{' '}
        $DEGEN unclaimed
      </div>
      <div>Click the button below 👇👇👇</div>
      <div>
        <button
          type="button"
          className="w-full bg-white text-black text-base font-bold p-3 px-6 rounded-[10px]"
          onClick={() => {
            setSearchParams({ claim: 'true' });
          }}
        >
          Claim
        </button>
      </div>
    </div>
  );
}
