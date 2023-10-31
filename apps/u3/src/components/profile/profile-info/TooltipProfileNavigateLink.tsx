import { useMemo, useState } from 'react';
import { Link, LinkProps, TooltipTrigger } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import TooltipBase from '../../common/tooltip/TooltipBase';
import ProfileInfoCard from './ProfileInfoCard';
import { FollowType } from '../ProfilePageFollowNav';

interface TooltipProfileNavigateLinkProps extends Omit<LinkProps, 'children'> {
  children: React.ReactNode;
  identity: string;
}

export default function TooltipProfileNavigateLink({
  identity,
  children,
  ...linkProps
}: TooltipProfileNavigateLinkProps) {
  const navigate = useNavigate();
  const profileUrl = useMemo(() => {
    if (identity) {
      return `/u/${identity}`;
    }
    return '';
  }, [identity]);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <TooltipTrigger
      delay={1000}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      {...linkProps}
    >
      <Link
        href={profileUrl}
        onPress={(e) => {
          e.continuePropagation();
          if (profileUrl) navigate(profileUrl);
        }}
      >
        {children}
      </Link>
      <TooltipBase placement="bottom">
        <ProfileInfoCard
          identity={identity}
          canNavigateToProfile
          onNavigateToProfileAfter={() => setIsOpen(false)}
          clickFollowers={() => {
            if (profileUrl) {
              navigate(`${profileUrl}?followType=${FollowType.FOLLOWERS}`);
              setIsOpen(false);
            }
          }}
          clickFollowing={() => {
            if (profileUrl) {
              navigate(`${profileUrl}?followType=${FollowType.FOLLOWING}`);
              setIsOpen(false);
            }
          }}
        />
      </TooltipBase>
    </TooltipTrigger>
  );
}
