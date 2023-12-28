import { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/utils';

export type PostCardData = {
  title: string;
  img: string;
  authorAvatar: string;
  authorDisplayName: string;
  authorHandle: string;
};

interface Props extends ComponentPropsWithRef<'div'> {
  data: PostCardData;
}

export function Top1PostCard({ data, className, ...wrapperProps }: Props) {
  const { title, img, authorAvatar, authorDisplayName, authorHandle } = data;
  return (
    <div
      className={cn('w-full flex flex-col gap-[10px]', className)}
      {...wrapperProps}
    >
      {title && (
        <span
          className={cn(
            'text-[#5D5E62] text-[20px] font-bold leading-normal line-clamp-2',
            !img && 'line-clamp-5'
          )}
        >
          {title}
        </span>
      )}
      {img && (
        <img
          className={cn('w-full h-[108px] object-cover', !title && 'h-[192px]')}
          src={img}
          alt=""
        />
      )}
      <div className="flex gap-[10px] mt-auto">
        {authorAvatar && (
          <img
            className="w-[40px] h-[40px] object-cover"
            src={authorAvatar}
            alt=""
          />
        )}
        <div className="flex-1 flex flex-col gap-[5px]">
          <span
            className={cn(
              'text-[#000] text-[20px] font-bold leading-none line-clamp-1'
            )}
          >
            {authorDisplayName}
          </span>
          {authorHandle && (
            <span
              className={cn(
                'text-[#5D5E62] text-[16px] font-bold leading-none line-clamp-1'
              )}
            >
              @{authorHandle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function PostCard({ data, className, ...wrapperProps }: Props) {
  const { title, img, authorDisplayName, authorHandle } = data;
  return (
    <div
      className={cn('w-full flex flex-col gap-[6px]', className)}
      {...wrapperProps}
    >
      <span className="text-[#000] text-[20px] font-bold leading-none">
        {authorDisplayName || authorHandle}
      </span>
      <div className="w-full flex items-end gap-[10px]">
        {title && (
          <span className="flex-1 text-[#5D5E62] text-[16px] font-bold leading-normal line-clamp-2">
            {title}
          </span>
        )}
        {img && (
          <img src={img} alt="" className="flex-1 h-[40px] object-cover" />
        )}
      </div>
    </div>
  );
}
