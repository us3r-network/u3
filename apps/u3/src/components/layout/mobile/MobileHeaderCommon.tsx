import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function MobileHeaderWrapper({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <div
      className={cn(
        'w-full h-[56px] p-[10px] box-border bg-[#14171A] flex items-center justify-between',
        'hidden max-sm:flex',
        className
      )}
      {...props}
    />
  );
}

export function MobileHeaderBackBtn({
  title,
  backToPath,
  className,
  ...props
}: ComponentPropsWithRef<'button'> & {
  title?: string;
  backToPath?: string;
}) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-[10px] text-[#FFF] text-[16px] font-medium',
        className
      )}
      onClick={() => {
        if (backToPath) {
          navigate(backToPath);
        } else {
          navigate(-1);
        }
      }}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path
          d="M2.6294 11.1007C2.02129 10.4926 2.02129 9.50739 2.6294 8.89928L9.85721 1.67147C10.149 1.37969 10.5447 1.21578 10.9574 1.21578C11.37 1.21578 11.7657 1.37969 12.0575 1.67147C12.3493 1.96325 12.5132 2.35898 12.5132 2.77161C12.5132 3.18424 12.3493 3.57997 12.0575 3.87175L5.92923 10L12.0575 16.1283C12.3493 16.42 12.5132 16.8158 12.5132 17.2284C12.5132 17.641 12.3493 18.0368 12.0575 18.3285C11.7657 18.6203 11.37 18.7842 10.9574 18.7842C10.5447 18.7842 10.149 18.6203 9.85721 18.3285L2.6294 11.1007Z"
          fill="white"
        />
      </svg>
      {title}
    </button>
  );
}
