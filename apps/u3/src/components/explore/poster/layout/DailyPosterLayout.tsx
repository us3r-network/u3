import { ComponentPropsWithRef } from 'react';
import Header from './Header';
import HighScoreDapps, { HighScoreDappsProps } from './dapps/HighScoreDapps';
import TopLinks, { TopLinksProps } from './links/TopLinks';
import Footer from './Footer';
import { cn } from '@/lib/utils';
import TopPosts, { TopPostsProps } from './posts/TopPosts';
import TopTopics, { TopTopicsProps } from './topics/TopTopics';

export type DailyPosterLayoutProps = ComponentPropsWithRef<'div'> &
  TopPostsProps &
  TopTopicsProps &
  HighScoreDappsProps &
  TopLinksProps;

export default function DailyPosterLayout({
  posts,
  farcasterUserData,
  topics,
  dapps,
  links,
  className,
  ...wrapperProps
}: DailyPosterLayoutProps) {
  return (
    <div
      className={cn(
        'w-[560px] flex flex-col items-start p-[30px] border-[2px] border-solid border-[#000] bg-[#F6F6F4]',
        'font-poster',
        className
      )}
      {...wrapperProps}
    >
      <Header />
      <div className="w-full h-[1px] bg-[#808684] mt-[20px] mb-[10px]" />
      <div className="w-full flex gap-[10px]">
        <TopPosts posts={posts} farcasterUserData={farcasterUserData} />
        <TopLinks links={links} />
      </div>
      <div className="w-full h-[1px] bg-[#808684] my-[10px]" />
      <div className="w-full flex">
        <TopTopics topics={topics} />
        <HighScoreDapps dapps={dapps} />
      </div>

      <Footer />
    </div>
  );
}
