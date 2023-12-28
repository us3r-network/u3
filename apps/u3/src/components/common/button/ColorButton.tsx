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
        'h-[48px] p-[12px] gap-[8px] rounded-[12px] text-white text-[16px] font-bold bg-[linear-gradient(90deg,_#CD62FF_0%,_#62AAFF_100%)]',
        className
      )}
      {...props}
    />
  );
}
