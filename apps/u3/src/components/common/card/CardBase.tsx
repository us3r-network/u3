/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 13:08:57
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-13 19:43:08
 * @Description: file description
 */
import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export default function CardBase({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'p-[20px] box-border bg-[#1b1e23] rounded-[20px] border-[1px] border-solid border-[#39424c] overflow-hidden',
        className
      )}
      {...props}
    />
  );
}
