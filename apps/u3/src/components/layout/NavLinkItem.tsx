import { ComponentPropsWithRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type NavLinkItemProps = ComponentPropsWithRef<'a'> & {
  active?: boolean;
};
export default function NavLinkItem({
  active,
  href,
  className,
  children,
  ...props
}: NavLinkItemProps) {
  const navigate = useNavigate();
  return (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      className={cn(
        `w-full p-[10px] box-border select-none rounded-[10px] leading-none no-underline outline-none transition-colors
         text-[#718096] text-[16px] font-medium
         flex gap-[10px] items-center`,
        `hover:bg-[#20262F]`,
        'max-sm:text-[14px]',
        active && 'bg-[#20262F] text-[#FFF]',
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
