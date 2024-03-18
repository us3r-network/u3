import { ComponentPropsWithRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ColorButton({
  className,
  ...props
}: ComponentPropsWithRef<'button'>) {
  return (
    <Button
      className={cn(
        'h-[48px] p-[12px] gap-[8px] rounded-[12px] bg-[#F41F4C] hover:bg-[#F41F4C]',
        'text-[#FFF] text-center text-[14px] font-medium leading-[20px]',
        'max-sm:h-[36px] max-sm:px-[12px] max-sm:py-[0px]',
        className
      )}
      {...props}
    />
  );
}
