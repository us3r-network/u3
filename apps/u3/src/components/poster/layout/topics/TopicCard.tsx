import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type TopicData = {
  logo: string;
  name: string;
  postCount: number;
};
interface Props extends ComponentPropsWithRef<'div'> {
  data: TopicData;
}
export default function TopicCard({ data, className, ...wrapperProps }: Props) {
  const { logo, name, postCount } = data;
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
        <span
          className={cn(
            'text-[#5D5E62] text-[16px] font-bold leading-none line-clamp-1'
          )}
        >
          {postCount} new posts
        </span>
      </div>
    </div>
  );
}
