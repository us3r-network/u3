import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface PlatformFollowCountsProps {
  identity?: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}
export default function PlatformFollowCounts({
  identity,
  postsCount,
  followersCount,
  followingCount,
}: PlatformFollowCountsProps) {
  const navigate = useNavigate();
  const pathSuffix = identity ? `/${identity}` : '';
  return (
    <div className="flex items-center justify-between">
      <CountItem
        label="Posts"
        count={postsCount}
        onClick={() => navigate(`/u${pathSuffix}?type=following`)}
      />
      <CountItem
        label="Followers"
        count={followersCount}
        onClick={() => navigate(`/u/contacts${pathSuffix}?type=follower`)}
      />
      <CountItem
        label="Following"
        count={followingCount}
        onClick={() => navigate(`/u/contacts${pathSuffix}?type=following`)}
      />
    </div>
  );
}

function CountItem({
  label,
  count,
  onClick,
  className,
}: ComponentPropsWithRef<'div'> & {
  label: string;
  count: number;
  onClick: (path: string) => void;
}) {
  return (
    <div
      className={cn(`flex flex-col items-center gap-1`, className)}
      onClick={onClick}
    >
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-xl font-bold text-white">{count}</p>
    </div>
  );
}
