import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export function PostList({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full flex flex-col gap-[1px] bg-[#212228] overflow-hidden`,
        className
      )}
      {...props}
    />
  );
}

export function LoadingWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full h-80vh flex justify-center items-center`,
        className
      )}
      {...props}
    />
  );
}

export function LoadingMoreWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full flex justify-center items-center mt-[20px]`,
        className
      )}
      {...props}
    />
  );
}

export function EndMsgContainer({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        `w-full flex justify-center items-center pt-[20px] text-[14px] text-[#718096]`,
        className
      )}
      {...props}
    />
  );
}
