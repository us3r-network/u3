import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export function CommunityList({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-[20px] max-lg:grid-cols-1 max-sm:gap-[10px]',
        className
      )}
      {...props}
    />
  );
}
