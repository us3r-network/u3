import SettingIcon from 'src/components/common/icons/setting';
import useUserData from 'src/hooks/social/farcaster/useUserData';
import { useLensCtx } from '@/contexts/social/AppLensCtx';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import { SocialPlatform } from '@/services/social/types';
import getAvatar from '@/utils/social/lens/getAvatar';
import { getHandle, getName } from '@/utils/social/lens/profile';
import FarcasterIcon from '../../common/icons/FarcasterIcon';
import LensIcon from '../../common/icons/LensIcon';

export function LensAccount() {
  const {
    isLogin: isLoginLens,
    sessionProfile: lensProfile,
    setOpenLensLoginModal,
  } = useLensCtx();

  if (!isLoginLens || !lensProfile) {
    return (
      <div
        className="w-full flex items-center gap-4"
        onClick={() => setOpenLensLoginModal(true)}
      >
        <LensIcon width="24px" height="24px" />
        <div>Sign in with Lens</div>
      </div>
    );
  }
  return (
    <div className="w-full flex items-center justify-between">
      <ProfileInfo
        avatar={getAvatar(lensProfile)}
        name={getName(lensProfile)}
        handle={getHandle(lensProfile)}
        platform={SocialPlatform.Lens}
      />
      <button
        className="setting"
        type="button"
        disabled
        onClick={() => {
          console.log('todo: lens account setting');
        }}
      >
        <SettingIcon />
      </button>
    </div>
  );
}

export function FarcasterAccount() {
  const {
    isConnected,
    currFid,
    currUserInfo,
    openFarcasterQR,
    setSignerSelectModalOpen,
  } = useFarcasterCtx();
  const userInfo = useUserData(currUserInfo?.[currFid]);

  if (!isConnected || !userInfo) {
    return (
      <div
        className="w-full flex items-center gap-4"
        onClick={() => openFarcasterQR()}
      >
        <FarcasterIcon width="24px" height="24px" />
        <div>Sign in with Farcaster</div>
      </div>
    );
  }
  return (
    <div className="w-full flex items-center justify-between">
      <ProfileInfo
        avatar={userInfo.avatar}
        name={userInfo.name}
        handle={userInfo.handle}
        platform={SocialPlatform.Farcaster}
      />
      <button
        className="setting"
        type="button"
        onClick={() => {
          setSignerSelectModalOpen(true);
        }}
      >
        <SettingIcon />
      </button>
    </div>
  );
}

function ProfileInfo({
  avatar,
  name,
  handle,
  platform,
}: {
  avatar: string;
  name: string;
  handle: string;
  platform: SocialPlatform;
}) {
  return (
    <div className="flex gap-4">
      <div className="relative">
        <img className="size-[24px] rounded-full" src={avatar} alt={name} />
        {platform === SocialPlatform.Lens ? (
          <LensIcon className="absolute bottom-0 left-0" />
        ) : platform === SocialPlatform.Farcaster ? (
          <FarcasterIcon className="absolute bottom-0 left-0" />
        ) : null}
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-base text-ellipsis">{name}</span>
        <span className="text-xs text-ellipsis">@{handle}</span>
      </div>
    </div>
  );
}
