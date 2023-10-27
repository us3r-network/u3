import { useMemo } from 'react';
import { Link, LinkProps, TooltipTrigger } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import TooltipBase from '../../common/tooltip/TooltipBase';
import ProfileInfoCard from './ProfileInfoCard';

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
  return (
    <TooltipTrigger delay={0} {...linkProps}>
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
        <ProfileInfoCard identity={identity} />
      </TooltipBase>
    </TooltipTrigger>
  );
}
