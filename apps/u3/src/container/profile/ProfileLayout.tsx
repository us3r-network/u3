import { Profile as LensProfile } from '@lens-protocol/react-web';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useParams } from 'react-router-dom';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import useDid from '@/hooks/profile/useDid';
import ProfileInfoCard from '@/components/profile/info/ProfileInfoCard';
import Loading from '@/components/common/loading/Loading';
import ProfileMenu from './ProfileMenu';

export type ProfileOutletContext = {
  did: string;
  fid: string;
  lensProfileFirst: LensProfile; // TODO: change to LensProfile array
  address: string[];
};

export default function ProfileLayout() {
  const { user: identity } = useParams();
  const {
    fid: identityFid,
    recommendAddress: identityAddress,
    lensProfileFirst: identityLensProfileFirst,
    loading: identityLoading,
  } = usePlatformProfileInfoData({ identity });
  const { did: identityDid, loading: identityDidLoading } = useDid(identity);
  // console.log(
  //   'identity',
  //   identity,
  //   'identityDid',
  //   identityDid,
  //   'identityFid',
  //   identityFid,
  //   'identityAddress',
  //   identityAddress,
  //   'identityLensProfileFirst',
  //   identityLensProfileFirst,
  //   'identityLoading',
  //   identityLoading,
  //   'identityDidLoading',
  //   identityDidLoading
  // );
  const session = useSession();
  const isSelf = useMemo(() => {
    return identity ? session && identityDid === session.id : !!session;
  }, [identity, session]);
  const {
    fid: u3ProfileFid,
    address: u3ProfileAddress,
    lensProfileFirst: u3ProfileLensProfileFirst,
    loading: u3ProfileLoading,
  } = useU3ProfileInfoData({
    did: identity ? identityDid : session?.id,
    isSelf,
  });
  const { currFid } = useFarcasterCtx();
  // console.log(
  //   'u3ProfileFid',
  //   u3ProfileFid,
  //   'u3ProfileAddress',
  //   u3ProfileAddress,
  //   'u3ProfileLensProfileFirst',
  //   u3ProfileLensProfileFirst,
  //   'u3ProfileLoading',
  //   u3ProfileLoading,
  //   'currFid',
  //   currFid
  // );
  if (identityLoading || identityDidLoading || u3ProfileLoading) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-[white] gap-4">
        <Loading />
        loading profile from multiple sources and merge...
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      {!isMobile && (
        <div className="bg-[#1B1E23] w-[280px] h-full max-sm:hidden">
          <ProfileMenu isSelf={isSelf} />
        </div>
      )}
      <div className="flex-1 h-full overflow-auto" id="profile-warper">
        <Outlet
          context={{
            did: identity ? identityDid : session?.id,
            fid: identity ? identityFid : u3ProfileFid || currFid || '',
            lensProfileFirst: identity
              ? identityLensProfileFirst
              : u3ProfileLensProfileFirst,
            address: identity
              ? [identityAddress].filter((address) => address.startsWith('0x'))
              : [u3ProfileAddress].filter((address) =>
                  address.startsWith('0x')
                ),
          }}
        />
      </div>
      {!isMobile && (
        <div className="bg-[#1B1E23] w-[320px] h-full overflow-auto border-b">
          <ProfileInfoCard isSelf={isSelf} identity={identity || session?.id} />
        </div>
      )}
    </div>
  );
}
