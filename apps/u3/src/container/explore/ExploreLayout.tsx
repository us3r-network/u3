import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import ExploreMenu from './ExploreMenu';
import { DailyPosterLayoutData } from '@/components/poster/layout/DailyPosterLayout';

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
    <div className="w-full h-screen flex">
      <div className="w-[280px] h-full max-sm:hidden">
        <ExploreMenu dailyPosterLayoutData={dailyPosterLayoutData} />
      </div>
      <div className="flex-1 h-full overflow-auto">
        <Outlet context={{ setDailyPosterLayoutData } as ExploreLayoutCtx} />
      </div>
    </div>
  );
}
