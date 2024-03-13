import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export function CommunityList({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-[20px] max-md:grid-cols-1',
        className
      )}
      {...props}
    />
  );
}
