import { Profile as LensProfile } from '@lens-protocol/react-web';
import { Profile as U3Profile } from '@us3r-network/data-model';
import { useSession } from '@us3r-network/auth-with-rainbowkit';
import { toast } from 'react-toastify';
import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlatformAccountData } from './PlatformAccounts';
import PlatformFollowCounts from './PlatformFollowCounts';
import ProfileBtns from './ProfileBtns';
import {
  PlatformProfileBasicInfo,
  U3ProfileBasicInfo,
} from './ProfileBasicInfo';
import { shortPubKey } from '../../../utils/shared/shortPubKey';
import { getDefaultAvatarWithIdentity } from '../../../utils/profile/avatar';
import { SocialPlatform } from '../../../services/social/types';
import { MultiPlatformShareMenuBtn } from '../../shared/share/MultiPlatformShareMenuBtn';
import { Copy } from '../../common/icons/copy';
import { cn } from '@/lib/utils';
import { getLensProfileExternalLinkWithHandle } from '@/utils/social/lens/getLensExternalLink';
import LensIcon from '@/components/common/icons/LensIcon';
import { getFarcasterProfileExternalLinkWithHandle } from '@/utils/social/farcaster/getFarcasterExternalLink';
import FarcasterIcon from '@/components/common/icons/FarcasterIcon';

const MY_PROFILE_SHARE_TITLE = 'View my profile in U3!';
const getShareNewFriendProfileTitle = (name) => `New friend ${name} in U3!`;

interface ProfileInfoCardLayoutProps extends ComponentPropsWithRef<'div'> {
  navigateToProfileUrl?: string;
  onNavigateToProfileAfter?: () => void;
  u3Profile?: U3Profile;
  address: string;
  identity?: string;
  platformAccounts: PlatformAccountData[];
  postsCount: number;
  followersCount: number;
  followingCount: number;
  lensProfiles: LensProfile[];
  fid?: number;
  loading?: boolean;
  isSelf: boolean;
  shareLink: string;
}
export default function ProfileInfoCardLayout({
  navigateToProfileUrl,
  onNavigateToProfileAfter,
  u3Profile,
  identity,
  address,
  platformAccounts,
  postsCount,
  followersCount,
  followingCount,
  lensProfiles,
  fid,
  loading,
  isSelf,
  shareLink,
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
      className="flex flex-col gap-4 p-6"
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
        postsCount={postsCount}
        followersCount={followersCount}
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

      {platformAccounts.length > 0 && (
        <div className="absolute top-6 right-6">
          <MultiPlatformShareMenuBtn
            shareLink={shareLink}
            shareLinkDefaultText={getShareNewFriendProfileTitle(
              u3Profile?.name && !u3Profile?.name?.startsWith('0x')
                ? u3Profile?.name
                : platformAccounts?.[0]?.name ||
                    platformAccounts?.[0]?.handle ||
                    address
            )}
            shareLinkEmbedTitle={'Profile'}
            popoverConfig={{ placement: 'bottom end', offset: 0 }}
          />
        </div>
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
