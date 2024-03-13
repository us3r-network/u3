import { ComponentPropsWithRef } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LoginButtonV2 from '@/components/layout/LoginButtonV2';
import NavLinkItem from '@/components/layout/NavLinkItem';
import AddPost from '@/components/social/AddPost';
import DailyPosterBtn from '@/components/poster/DailyPosterBtn';
import { DailyPosterLayoutData } from '@/components/poster/layout/DailyPosterLayout';

export default function ExploreMenu({
  className,
  dailyPosterLayoutData,
  ...props
}: ComponentPropsWithRef<'div'> & {
  dailyPosterLayoutData: DailyPosterLayoutData;
}) {
  const { pathname } = useLocation();
  const isHomePath = pathname === '/';
  const isCommunitiesPath = pathname.startsWith('/communities');
  const isPosterGalleryPath = pathname === '/poster-gallery';
  const isPostsPath = pathname.startsWith('/social');

  return (
    <div
      className={cn(
        `
        w-[280px] h-full flex flex-col bg-[#1B1E23]`,
        className
      )}
      {...props}
    >
      <div className="flex-1 w-full p-[20px] box-border overflow-auto flex flex-col">
        <h1 className="text-[#FFF] text-[24px] font-medium leading-[20px] mb-[20px]">
          Explore
        </h1>
        <div className="flex-1 w-full flex flex-col gap-[5px]">
          <NavLinkItem href="/" active={isHomePath}>
            Home
          </NavLinkItem>
          <NavLinkItem href="/poster-gallery" active={isPosterGalleryPath}>
            Poster Gallery
          </NavLinkItem>
          <NavLinkItem href="/communities" active={isCommunitiesPath}>
            Communities
          </NavLinkItem>
          <NavLinkItem href="/social" active={isPostsPath}>
            Posts
          </NavLinkItem>
        </div>
        {isPostsPath && <AddPost />}
        {isHomePath && <DailyPosterBtn {...dailyPosterLayoutData} />}
      </div>
      <LoginButtonV2 />
    </div>
  );
}
