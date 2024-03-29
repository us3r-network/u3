import { Profile as LensProfile } from '@lens-protocol/react-web';
import { Profile as U3Profile } from '@us3r-network/data-model';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { toast } from 'react-toastify';
import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PlatformFollowCounts from './PlatformFollowCounts';
import ProfileBtns from './ProfileBtns';
import {
  PlatformProfileBasicInfo,
  U3ProfileBasicInfo,
} from './ProfileBasicInfo';
import { shortPubKey } from '@/utils/shared/shortPubKey';
import { getDefaultAvatarWithIdentity } from '@/utils/profile/avatar';
import { PlatformAccountData, SocialPlatform } from '@/services/social/types';
import { Copy } from '../../common/icons/copy';
import { cn } from '@/lib/utils';
import { getLensProfileExternalLinkWithHandle } from '@/utils/social/lens/getLensExternalLink';
import LensIcon from '@/components/common/icons/LensIcon';
import { getFarcasterProfileExternalLinkWithHandle } from '@/utils/social/farcaster/getFarcasterExternalLink';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';

interface ProfileInfoCardLayoutProps extends ComponentPropsWithRef<'div'> {
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  u3Profile?: U3Profile;
  address: string;
  identity?: string;
  platformAccounts: PlatformAccountData[];
  postCount: number;
  followerCount: number;
  followingCount: number;
  lensProfiles: LensProfile[];
  fid?: number;
  loading?: boolean;
  isSelf: boolean;
}
export default function ProfileInfoCardLayout({
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  u3Profile,
  identity,
  address,
  platformAccounts,
  postCount,
  followerCount,
  followingCount,
  lensProfiles,
  fid,
  loading,
  isSelf,
  ...wrapperProps
}: ProfileInfoCardLayoutProps) {
  const session = useSession();

  const findLensAccount = platformAccounts?.find(
    (item) => item.platform === SocialPlatform.Lens
  );
  const findFarcasterAccount = platformAccounts?.find(
    (item) => item.platform === SocialPlatform.Farcaster
  );
  const showFollowBtn = !!findLensAccount || !!findFarcasterAccount;
  const showMessageBtn = !!address;
  const navigate = useNavigate();
  const pathSuffix = identity ? `/${identity}` : '';

  if (!address) {
    return null;
  }

  return (
    <div
      className="flex flex-col gap-4 p-6 w-full"
      onClick={(e) => {
        e.stopPropagation();
      }}
      {...wrapperProps}
    >
      <PlatformProfileBasicInfo
        data={{
          avatar:
            u3Profile?.avatar ||
            platformAccounts?.[0]?.avatar ||
            getDefaultAvatarWithIdentity(
              address || String(platformAccounts?.[0]?.id) || ''
            ),
          name:
            u3Profile?.name ||
            platformAccounts?.[0]?.name ||
            shortPubKey(address),
          bio:
            u3Profile?.bio ||
            platformAccounts?.[0]?.bio ||
            'There is nothing here',
          identity: platformAccounts?.[0]?.id,
        }}
        navigateToProfileUrl={navigateToProfileUrl}
        onNavigateToProfileAfter={onNavigateToProfileAfter}
      />
      {session?.id && !isSelf && (
        <ProfileBtns
          showFollowBtn={showFollowBtn}
          showMessageBtn={showMessageBtn}
          lensProfiles={lensProfiles}
          fid={fid}
          address={address}
        />
      )}
      <PlatformFollowCounts
        identity={identity}
        postCount={postCount}
        followerCount={followerCount}
        followingCount={followingCount}
      />
      {address && (
        <Wallets
          address={address}
          onClick={() => navigate(`/u${pathSuffix}?type=following`)}
        />
      )}
      {platformAccounts?.length > 0 && (
        <SocialAccounts accounts={platformAccounts} />
      )}
    </div>
  );
}

function SocialAccounts({
  accounts,
  onClick,
  className,
}: ComponentPropsWithRef<'div'> & {
  accounts: PlatformAccountData[];
  onClick?: (path: string) => void;
}) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      onClick={onClick}
    >
      <p className="text-gray-500">Social Accounts</p>
      <div className="flex items-center gap-1">
        {accounts.map((account) => {
          if (account.platform === SocialPlatform.Lens) {
            return (
              <a
                key={account.id}
                title={account.name || account.handle || String(account.id)}
                href={getLensProfileExternalLinkWithHandle(
                  account.handle || account.name
                )}
                target="_blank"
                rel="noreferrer"
              >
                <LensIcon width="20px" height="20px" />
              </a>
            );
          }
          if (account.platform === SocialPlatform.Farcaster) {
            return (
              <a
                key={account.id}
                title={account.name || account.handle || String(account.id)}
                href={getFarcasterProfileExternalLinkWithHandle(
                  account.handle || account.name
                )}
                target="_blank"
                rel="noreferrer"
              >
                <FarcasterIcon width="20px" height="20px" />
              </a>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

function Wallets({
  address,
  onClick,
  className,
}: ComponentPropsWithRef<'div'> & {
  address: string;
  onClick: (path: string) => void;
}) {
  return (
    <div
      className={cn('flex items-center justify-between', className)}
      onClick={onClick}
    >
      <p className="text-gray-500">Wallet Address</p>
      <div
        className="flex items-center gap-1"
        onClick={() => {
          navigator.clipboard.writeText(address).then(() => {
            toast.success('Copied!');
          });
        }}
      >
        <span className="text-white">{shortPubKey(address)}</span>
        <Copy />
      </div>
    </div>
  );
}
