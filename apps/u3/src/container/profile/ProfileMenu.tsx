import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';

export default function ProfileMenu({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
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
      </div>
      <LoginButtonV2 />
    </div>
  );
}
