import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import ExploreMenu from './ExploreMenu';
import { DailyPosterLayoutData } from '@/components/poster/layout/DailyPosterLayout';
import { cn } from '@/lib/utils';
import ExploreMobileHeader from './ExploreMobileHeader';

export type ExploreLayoutCtx = {
  setDailyPosterLayoutData: (data: DailyPosterLayoutData) => void;
};

export default function ExploreLayout() {
  const [dailyPosterLayoutData, setDailyPosterLayoutData] =
    useState<DailyPosterLayoutData>({
      posts: [],
      farcasterUserData: {},
      topics: [],
      dapps: [],
      links: [],
    });
  return (
    <div className={cn('w-full h-full flex', 'max-sm:flex-col')}>
      <ExploreMenu
        className="max-sm:hidden"
        dailyPosterLayoutData={dailyPosterLayoutData}
      />
      <ExploreMobileHeader />
      <div className="flex-1 h-full overflow-auto">
        <Outlet context={{ setDailyPosterLayoutData } as ExploreLayoutCtx} />
      </div>
    </div>
  );
}
