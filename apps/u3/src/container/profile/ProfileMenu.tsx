import { ComponentPropsWithRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import NavLinkItem from '@/components/layout/NavLinkItem';

export default function ProfileMenu({
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
        w-full h-full flex flex-col bg-[#1B1E23]`,
        className
      )}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto">
        <h1 className="text-[#FFF] text-[24px] font-medium leading-[20px] mb-[20px]">
          {user || 'My'} Profile
        </h1>
        <div className="flex-1 w-full flex flex-col gap-[5px]">
          <NavLinkItem
            href={`/u${pathSuffix}`}
            active={pathname === `/u${pathSuffix}`}
          >
            Posts
          </NavLinkItem>
          <NavLinkItem
            href={`/u/contacts${pathSuffix}`}
            active={pathname === `/u/contacts${pathSuffix}`}
          >
            Contacts
          </NavLinkItem>
          <NavLinkItem
            href={`/u/activity${pathSuffix}`}
            active={pathname === `/u/activity${pathSuffix}`}
          >
            Activity
          </NavLinkItem>
          <NavLinkItem
            href={`/u/fav${pathSuffix}`}
            active={pathname === `/u/fav${pathSuffix}`}
          >
            Favorites
          </NavLinkItem>
          {/* <NavLinkItem
            href={`/u/asset${pathSuffix}`}
            active={pathname === `/u/asset${pathSuffix}`}
          >
            Assets
          </NavLinkItem>
          <NavLinkItem
            href={`/u/gallery${pathSuffix}`}
            active={pathname === `/u/gallery${pathSuffix}`}
          >
            Gallery
          </NavLinkItem> */}
        </div>
      </div>
      <LoginButtonV2 />
    </div>
  );
}
