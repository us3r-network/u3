import { ComponentPropsWithRef, useState } from 'react';
import DailyPosterModal from './DailyPosterModal';
import { DailyPosterLayoutData } from './layout/DailyPosterLayout';
import { cn } from '@/lib/utils';
import ColorButton from '../common/button/ColorButton';

export default function DailyPosterBtn({
  className,
  posts,
  farcasterUserData,
  topics,
  dapps,
  links,
  ...props
}: ComponentPropsWithRef<'button'> & DailyPosterLayoutData) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ColorButton
        className={cn(
          'flex items-center gap-2 text-white text-[16px]',
          'h-[60px] p-[16px] rounded-[20px] gap-[8px] box-border',
          className
        )}
        id="createPosterBtn"
        onClick={() => setOpen(true)}
        {...props}
      >
        <span>Mint Daily Poster</span>
      </ColorButton>
      <DailyPosterModal
        posts={posts}
        farcasterUserData={farcasterUserData}
        topics={topics}
        dapps={dapps}
        links={links}
        open={open}
        closeModal={() => setOpen(false)}
      />
    </>
  );
}
