import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type DappData = {
  logo: string;
  name: string;
  types: string[];
};
interface Props extends ComponentPropsWithRef<'div'> {
  data: DappData;
}
export default function DappCard({ data, className, ...wrapperProps }: Props) {
  const { logo, name, types } = data;
  return (
    <div className={cn('w-full flex gap-[5px]', className)} {...wrapperProps}>
      {logo && (
        <img className="w-[40px] h-[40px] object-cover" src={logo} alt="" />
      )}
      <div className="w-0 flex-1 flex flex-col gap-[6px]">
        <span
          className={cn(
            'text-[#000] text-[20px] font-bold leading-none line-clamp-1'
          )}
        >
          {name}
        </span>
        <div
          className={cn(
            'text-[#5D5E62] text-[16px] font-bold leading-none line-clamp-1'
          )}
        >
          {types.map((type) => (
            <span key={type}>{type}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
