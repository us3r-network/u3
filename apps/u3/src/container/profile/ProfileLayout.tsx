import { Profile as LensProfile } from '@lens-protocol/react-web';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useMemo } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import useDid from '@/hooks/profile/useDid';
import ProfileInfoCard from '@/components/profile/info/ProfileInfoCard';
import Loading from '@/components/common/loading/Loading';
import ProfileMenu from './ProfileMenu';
import ProfileMobileHeader from './ProfileMobileHeader';

export type ProfileOutletContext = {
  did: string;
  fid: string;
  lensProfileFirst: LensProfile; // TODO: change to LensProfile array
  address: string[];
};

export default function ProfileLayout() {
  const { user: identity } = useParams();
  const { pathname } = useLocation();
  const isFav = useMemo(() => pathname.includes('fav'), [pathname]);
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
      </div>
    );
  }

  return (
    <>
      {/* Desktop */}
      <div className="w-full h-full flex max-sm:hidden">
        <div className="bg-[#1B1E23] w-[280px] h-full">
          <ProfileMenu />
        </div>
        <div className="flex-1 h-full overflow-auto" id="profile-warper">
          <Outlet
            context={{
              did: identity ? identityDid : session?.id,
              fid: identity ? identityFid : u3ProfileFid || currFid || '',
              lensProfileFirst: identity
                ? identityLensProfileFirst
                : u3ProfileLensProfileFirst,
              address: identity
                ? [identityAddress].filter((address) =>
                    address.startsWith('0x')
                  )
                : [u3ProfileAddress].filter((address) =>
                    address.startsWith('0x')
                  ),
            }}
          />
        </div>
        <div className="bg-[#1B1E23] w-[320px] h-full overflow-auto">
          <ProfileInfoCard isSelf={isSelf} identity={identity || session?.id} />
        </div>
      </div>
      {/* Mobile */}
      <div className="w-full h-full flex-col sm:hidden">
        <ProfileMobileHeader />
        {!isFav && (
          <div className="bg-[#1B1E23] overflow-auto">
            <ProfileInfoCard
              isSelf={isSelf}
              identity={identity || session?.id}
            />
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
                ? [identityAddress].filter((address) =>
                    address.startsWith('0x')
                  )
                : [u3ProfileAddress].filter((address) =>
                    address.startsWith('0x')
                  ),
            }}
          />
        </div>
      </div>
    </>
  );
}
