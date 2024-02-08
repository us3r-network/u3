import { ComponentPropsWithRef, useState } from 'react';
import { cn } from '@/lib/utils';
import CreateModal from './CreateModal';

export default function RedEnvelopeFloatingWindow() {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="
      w-[280px] h-auto
      flex flex-col items-start gap-[20px]
      rounded-[20px] bg-[#F41F4C] p-[20px] box-border
      fixed bottom-[20px] right-[54px] z-[100]
      "
    >
      <div className="text-[#FFF] text-[14px] font-medium">🧧 Red Envelope</div>
      <CommonButton
        className="w-full"
        onClick={() => {
          setOpen(true);
        }}
      >
        Create My Red Envelope 🧧
      </CommonButton>
      <CreateModal open={open} closeModal={() => setOpen(false)} />
    </div>
  );
}

function CommonButton({
  className,
  ...props
}: ComponentPropsWithRef<'button'>) {
  return (
    <button
      type="button"
      className={cn(
        'flex px-[24px] py-[12px] box-border justify-center items-center rounded-[10px] bg-[#FFF]',
        'text-[#14171A] text-center text-[16px] font-medium leading-[24px] whitespace-nowrap',
        className
      )}
      {...props}
    />
  );
}
