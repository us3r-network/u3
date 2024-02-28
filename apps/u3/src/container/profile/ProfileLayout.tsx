import { Profile as LensProfile } from '@lens-protocol/react-web';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useU3ProfileInfoData from '@/hooks/profile/useU3ProfileInfoData';
import usePlatformProfileInfoData from '@/hooks/profile/usePlatformProfileInfoData';
import useDid from '@/hooks/profile/useDid';
import ProfileInfoCard from '@/components/profile/profile-info/ProfileInfoCard';
import Loading from '@/components/common/loading/Loading';
import ProfileMenu from './ProfileMenu';

export type ProfileOutletContext = {
  did: string;
  fid: string;
  lensProfileFirst: LensProfile; // TODO: change to LensProfile array
  address: string[];
};

export default function ProfileLayout() {
  const navigate = useNavigate();

  const { user: identity } = useParams();
  const isSelf = useMemo(() => {
    return !identity;
  }, [identity]);
  const {
    fid: identityFid,
    recommendAddress: identityAddress,
    lensProfileFirst: identityLensProfileFirst,
    loading: identityLoading,
  } = usePlatformProfileInfoData({ identity });
  const { did: identityDid, loading: identityDidLoading } = useDid(identity);

  const session = useSession();
  const {
    fid: u3ProfileFid,
    address: u3ProfileAddress,
    lensProfileFirst: u3ProfileLensProfileFirst,
    loading: u3ProfileLoading,
  } = useU3ProfileInfoData({
    did: identityDid || session?.id,
    isSelf,
  });
  const { currFid } = useFarcasterCtx();
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
  //   identityDidLoading,
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
      <div className="w-full h-screen flex flex-col justify-center items-center text-[white]">
        <Loading />
        loading profile from multiple sources and merge...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex">
      {!isMobile && (
        <div className="bg-[#1B1E23] w-[280px] h-full max-sm:hidden">
          <ProfileMenu />
        </div>
      )}
      <div className="flex-1 h-full overflow-auto">
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
        <div className="bg-[#1B1E23] w-[320px] h-full overflow-auto">
          <ProfileInfoCard
            isSelf={isSelf}
            identity={identity || session?.id}
            clickFollowing={() => navigate('/u/contacts?type=following')}
            clickFollowers={() => navigate('/u/contacts?type=followers')}
          />
        </div>
      )}
    </div>
  );
}

// function PostsOld() {
//   const { user: identity } = useParams();
//   const { did, loading: didLoading } = useDid(identity);
//   const { getProfileWithDid } = useProfileState();
//   const [hasProfile, setHasProfile] = useState(false);
//   const [hasProfileLoading, setHasProfileLoading] = useState(false);
//   useEffect(() => {
//     (async () => {
//       if (isDidPkh(did)) {
//         setHasProfileLoading(true);
//         const profile = await getProfileWithDid(did);
//         if (profile) {
//           setHasProfile(true);
//         }
//         setHasProfileLoading(false);
//       } else {
//         setHasProfile(false);
//       }
//     })();
//   }, [did]);

//   const session = useSession();
//   const isSelf = useMemo(() => {
//     return !identity;
//   }, [identity]);

//   if (!identity) {
//     return <U3ProfileContainer did={session?.id} isSelf={isSelf} />;
//   }
//   if (didLoading || hasProfileLoading) {
//     return null;
//   }
//   if (isDidPkh(did) && hasProfile) {
//     return <U3ProfileContainer did={did} isSelf={isSelf} />;
//   }
//   if (identity) {
//     return <PlatformProfileContainer identity={identity} isSelf={isSelf} />;
//   }
//   return null;
// }

// function U3ProfileContainer({ did, isSelf }: { did: string; isSelf: boolean }) {
//   const session = useSession();
//   const {
//     fid: u3ProfileFid,
//     address,
//     lensProfileFirst,
//     loading,
//   } = useU3ProfileInfoData({
//     did,
//     isSelf,
//   });
//   const { currFid } = useFarcasterCtx();
//   const fid = useMemo(() => {
//     if (isSelf) {
//       return `${currFid || ''}`;
//     }
//     return `${u3ProfileFid || ''}`;
//   }, [currFid, isSelf, u3ProfileFid]);

//   if (loading) {
//     return (
//       <LoadingWrapper>
//         <Loading />
//       </LoadingWrapper>
//     );
//   }

//   return (
//     <Posts
//       fid={fid}
//       lensProfileFirst={lensProfileFirst}
//       identity=""
//       isLoginUser={did === session?.id}
//     />
//   );
// }
// function PlatformProfileContainer({
//   identity,
//   isSelf,
// }: {
//   identity: string;
//   isSelf: boolean;
// }) {
//   const { fid, recommendAddress, lensProfileFirst, loading } =
//     usePlatformProfileInfoData({ identity });

//   if (loading) {
//     return (
//       <LoadingWrapper>
//         <Loading />
//       </LoadingWrapper>
//     );
//   }
//   return (
//     <Posts
//       fid={fid}
//       lensProfileFirst={lensProfileFirst}
//       identity={identity}
//       isLoginUser={false}
//     />
//   );
// }
