import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, LinkProps, TooltipTrigger } from 'react-aria-components';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
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
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!linkRef.current || !isOpen) return;
    const el = linkRef.current;

    const handleMouseWheel = (e: WheelEvent) => {
      setIsOpen(false);
    };
    el.addEventListener('wheel', handleMouseWheel);

    // eslint-disable-next-line consistent-return
    return () => {
      el.removeEventListener('wheel', handleMouseWheel);
    };
  }, [isOpen]);

  const linkEl = (
    <LinkStyled
      ref={linkRef}
      href={profileUrl}
      onPress={(e) => {
        e.continuePropagation();
        if (profileUrl) navigate(profileUrl);
      }}
      {...linkProps}
    >
      {children}
    </LinkStyled>
  );
  if (isMobile) {
    return linkEl;
  }
  return (
    <TooltipTrigger
      delay={500}
      closeDelay={50}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
    >
      {linkEl}
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
const LinkStyled = styled(Link)`
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  outline: none;

  &[data-hovered] {
    outline: none;
  }

  &[data-pressed] {
    outline: none;
  }

  &[data-focus-visible] {
    outline: none;
  }
`;
