import { ComponentPropsWithRef } from 'react';
import AddPostMobileBtn from '@/components/social/AddPostMobileBtn';
import { MobileHeaderWrapper } from '../layout/mobile/MobileHeaderCommon';
import { cn } from '@/lib/utils';
import SearchIconBtn from '../layout/SearchIconBtn';

export default function MobileCommunityHeader({
  className,
  ...props
}: ComponentPropsWithRef<'div'>) {
  return (
    <MobileHeaderWrapper className={cn('bg-[#20262F]', className)} {...props}>
      <div className="flex items-center gap-[20px]">
        <SearchIconBtn />
        <AddPostMobileBtn />
      </div>
    </MobileHeaderWrapper>
  );
}
