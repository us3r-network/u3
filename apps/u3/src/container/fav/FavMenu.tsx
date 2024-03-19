import { ComponentPropsWithRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import NavLinkItem from '@/components/layout/NavLinkItem';

export default function FavMenu({
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
        w-full h-full flex flex-col`,
        className
      )}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto">
        <h1 className="text-[#FFF] text-[24px] font-medium leading-[20px] mb-[20px]">
          {user || 'My'} Favorites
        </h1>
        <div className="flex-1 w-full flex flex-col gap-[5px]">
          <NavLinkItem
            href={`/fav/posts${pathSuffix}`}
            active={pathname === `/fav/posts${pathSuffix}`}
          >
            Posts
          </NavLinkItem>
          <NavLinkItem
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
    </div>
  );
}
