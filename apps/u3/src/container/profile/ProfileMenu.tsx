import { ComponentPropsWithRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import NavLinkItem from '@/components/layout/NavLinkItem';

export default function ProfileMenu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  const { pathname } = useLocation();
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
          Profile
        </h1>
        <div className="flex-1 w-full flex flex-col gap-[5px]">
          <NavLinkItem href="/u" active={pathname === '/u'}>
            My Profile
          </NavLinkItem>
          <NavLinkItem href="/save" active={pathname === '/save'}>
            My Favorites
          </NavLinkItem>
        </div>
      </div>
      <LoginButtonV2 />
    </div>
  );
}
