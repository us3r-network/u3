import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';
import LinkLogo from '@/components/news/links/LinkLogo';

export type LinkCardData = {
  logo: string;
  errorLogo?: string;
  title: string;
  url: string;
};
interface Props extends ComponentPropsWithRef<'div'> {
  data: LinkCardData;
}
export default function LinkCard({ data, className, ...wrapperProps }: Props) {
  const { logo, errorLogo, title, url } = data;
  return (
    <div className={cn('w-full flex gap-[10px]', className)} {...wrapperProps}>
      {logo && (
        <LinkLogo
          className="w-[50px] h-[50px] object-cover"
          logo={logo}
          link={url}
          errorLogo={errorLogo}
          alt=""
        />
      )}
      <div className="w-0 flex-1 flex flex-col gap-[10px]">
        <span
          className={cn(
            'text-[#000] text-[20px] font-bold leading-none line-clamp-1'
          )}
        >
          {title}
        </span>
        {url && (
          <span
            className={cn(
              'text-[#5D5E62] text-[16px] font-bold leading-none line-clamp-1'
            )}
          >
            {url}
          </span>
        )}
      </div>
    </div>
  );
}
