import { toast } from 'react-toastify';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useCallback } from 'react';
import { UserDataType, makeUserDataAdd } from '@farcaster/hub-web';

import RegisterAndPay from '@/components/social/farcaster/signupv2/RegisterAndPay';
import AddAccountKey from '@/components/social/farcaster/signupv2/AddAccountKey';
import FnameRegister from '@/components/social/farcaster/signupv2/FnameRegister';
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '@/constants/farcaster';
import RentStorage from '@/components/social/farcaster/signupv2/RentStorage';
import { ChevronRightDouble } from '@/components/common/icons/chevon-right-double';
import ColorButton from '@/components/common/button/ColorButton';
import { cn } from '@/lib/utils';
import {
  MobileHeaderBackBtn,
  MobileHeaderWrapper,
} from '@/components/layout/mobile/MobileHeaderCommon';

export default function FarcasterSignupV2() {
  const {
    fid,
    fname,
    signer,
    hasStorage,
    setHasStorage,
    setSigner,
    setFid,
    setFname,
  } = useOutletContext<any>();
  const navigate = useNavigate();

  const makePrimaryName = useCallback(
    async (name: string) => {
      if (!name || !signer || !fid || !hasStorage) return;
      try {
        // eslint-disable-next-line no-underscore-dangle
        const cast = (
          await makeUserDataAdd(
            {
              type: UserDataType.USERNAME,
              value: name,
            },
            { fid, network: FARCASTER_NETWORK },
            signer
          )
        )._unsafeUnwrap();
        const result = await FARCASTER_WEB_CLIENT.submitMessage(cast);
        if (result.isErr()) {
          throw new Error(result.error.message);
        }
        toast.success('successfully primary name to farcaster');
      } catch (error: unknown) {
        console.error(error);
        toast.error('failed to primary name');
      }
    },
    [fid, signer, hasStorage]
  );
  return (
    <div className={cn('w-full h-full flex-col')}>
      <h3 className="text-white font-bold text-4xl italic text-center pt-[20px] max-sm:hidden">
        Sign up for Farcaster
      </h3>
      <MobileHeaderWrapper>
        <MobileHeaderBackBtn title="Sign up for Farcaster" />
      </MobileHeaderWrapper>

      <div className="flex-1 h-full overflow-auto p-[20px] box-border max-sm:h-[calc(100vh-56px-80px)]">
        <div className="steps flex flex-wrap items-center justify-between gap-5 w-full max-sm:flex-col">
          <RegisterAndPay className="max-sm:w-full" fid={fid} setFid={setFid} />
          <AddAccountKey
            className="max-sm:w-full"
            fid={fid}
            signer={signer}
            setSigner={setSigner}
          />
          <FnameRegister
            className="max-sm:w-full"
            fid={fid}
            fname={fname}
            signer={signer}
            setFname={setFname}
            makePrimaryName={makePrimaryName}
          />
          <RentStorage
            className="max-sm:w-full"
            fid={fid}
            hasStorage={hasStorage}
            setHasStorage={setHasStorage}
          />
        </div>
        <div className="w-full text-white flex justify-end">
          {(fid && fname && signer && hasStorage && (
            <ColorButton
              type="button"
              onClick={() => {
                navigate('/farcaster/profile');
              }}
            >
              Setup your profile
              <ChevronRightDouble />
            </ColorButton>
          )) ||
            null}
        </div>
      </div>
    </div>
  );
}
