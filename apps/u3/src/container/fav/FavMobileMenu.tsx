import { ComponentPropsWithRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavLinkItem from '@/components/layout/NavLinkItem';

export default function FavMobileMenu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { user } = useParams();
  const { pathname } = useLocation();
  const pathSuffix = user ? `/${user}` : '';
  return (
    <div
      className={cn(
        `
        w-full flex p-4`,
        className
      )}
      {...props}
    >
      <div className="flex divide-x-2">
        <NavLinkItem
          className="rounded-none py-0"
          href={`/fav/posts${pathSuffix}`}
          active={pathname === `/fav/posts${pathSuffix}`}
        >
          Posts
        </NavLinkItem>
        <NavLinkItem
          className="rounded-none py-0"
          href={`/fav/links${pathSuffix}`}
          active={pathname === `/fav/links${pathSuffix}`}
        >
          Links
        </NavLinkItem>
        {/* <NavLinkItem
            href={`/fav/frame${pathSuffix}`}
            active={pathname === `/fav/frame${pathSuffix}`}
          >
            Frame
          </NavLinkItem>
          <NavLinkItem
            href={`/fav/apps${pathSuffix}`}
            active={pathname === `/fav/apps${pathSuffix}`}
          >
            Apps
          </NavLinkItem> */}
      </div>
    </div>
  );
}
