import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { HotPostsData } from '../../components/explore/posts/HotPosts';
import { TopLinksData } from '../../components/explore/links/TopLinks';
import { HighScoreDappsData } from '../../components/explore/dapps/HighScoreDapps';
import {
  getHotPosts,
  getTopLinks,
  getHighScoreDapps,
} from '../../services/shared/api/explore';
import { processMetadata } from '../../utils/news/link';
import HomeLayout from '../../components/explore/HomeLayout';
import { TopChannelsData } from '@/components/explore/channels/TopChannels';
import { useFarcasterCtx } from '@/contexts/social/FarcasterCtx';
import type { ExploreLayoutCtx } from './ExploreLayout';
import { HotCommunitiesData } from '@/components/explore/community/HotCommunities';
import { fetchTrendingCommunities } from '@/services/community/api/community';

type FarcasterUserData = { [key: string]: { type: number; value: string }[] };
type HotPostsState = {
  posts: HotPostsData;
  farcasterUserData: FarcasterUserData;
  isLoading: boolean;
};
type TopLinksState = {
  links: TopLinksData;
  isLoading: boolean;
};
type TopChannelsState = {
  channels: TopChannelsData;
  isLoading: boolean;
};
type HighScoreDappsState = {
  dapps: HighScoreDappsData;
  isLoading: boolean;
};
type HotCommunitiesState = {
  communities: HotCommunitiesData;
  isLoading: boolean;
};
export type ExploreHomeState = {
  hotPosts: HotPostsState;
  topLinks: TopLinksState;
  topChannels: TopChannelsState;
  highScoreDapps: HighScoreDappsState;
  hotCommunities: HotCommunitiesState;
};

export default function Home() {
  const { setDailyPosterLayoutData } = useOutletContext<ExploreLayoutCtx>();
  const [hotPosts, setHotPosts] = useState<HotPostsState>({
    posts: [],
    farcasterUserData: {},
    isLoading: true,
  });

  const [topLinks, setTopLinks] = useState<TopLinksState>({
    links: [],
    isLoading: true,
  });

  const [topChannels, setTopChannels] = useState<TopChannelsState>({
    channels: [],
    isLoading: true,
  });

  const [highScoreDapps, setHighScoreDapps] = useState<HighScoreDappsState>({
    dapps: [],
    isLoading: true,
  });

  const [hotCommunities, setHotCommunities] = useState<HotCommunitiesState>({
    communities: [],
    isLoading: true,
  });

  useEffect(() => {
    getHotPosts()
      .then((res) => {
        const { data } = res.data;
        const { casts, farcasterUserData: farcasterUserDataTmp } = data;

        const temp: FarcasterUserData = {};
        farcasterUserDataTmp.forEach((item) => {
          if (temp[item.fid]) {
            temp[item.fid].push(item);
          } else {
            temp[item.fid] = [item];
          }
        });
        setHotPosts({
          posts: casts
            .filter((item) => item?.platform && item?.data)
            .splice(0, 6),
          farcasterUserData: temp,
          isLoading: false,
        });
      })
      .catch(() => {
        setHotPosts((pre) => ({ ...pre, posts: [], isLoading: false }));
      });

    getTopLinks()
      .then((res) => {
        const { data } = res.data;
        const { data: links } = data;
        setTopLinks({
          links: (links || []).map((item) => {
            const metadata = processMetadata(item?.metadata);
            return {
              logo: metadata?.icon,
              title: metadata?.title,
              url: item?.url,
              errorLogo: metadata?.image,
            };
          }),
          isLoading: false,
        });
      })
      .catch(() => {
        setTopLinks((pre) => ({ ...pre, links: [], isLoading: false }));
      });

    getHighScoreDapps()
      .then((res) => {
        const { data: dapps } = res.data;

        setHighScoreDapps({
          dapps: dapps.map((item) => ({
            id: item.id,
            logo: item.image,
            name: item.name,
            types: item?.types || [],
            linkStreamId: item?.linkStreamId,
          })),
          isLoading: false,
        });
      })
      .catch(() => {
        setHighScoreDapps((pre) => ({ ...pre, dapps: [], isLoading: false }));
      });

    fetchTrendingCommunities({
      pageSize: 6,
      pageNumber: 1,
    })
      .then((res) => {
        const { data: communities } = res.data;
        setHotCommunities({
          communities,
          isLoading: false,
        });
      })
      .catch(() => {
        setHotCommunities((pre) => ({
          ...pre,
          communities: [],
          isLoading: false,
        }));
      });
  }, []);

  const { trendChannels, trendChannelsLoading } = useFarcasterCtx();
  useEffect(() => {
    setTopChannels({
      channels: (trendChannels || []).splice(0, 4).map((item) => {
        return {
          channel_id: item.channel_id,
          logo: item?.image,
          name: item.name,
          followerCount: Number(item?.followerCount || 0),
          postCount: Number(item?.count),
        };
      }),
      isLoading: trendChannelsLoading,
    });
  }, [trendChannels, trendChannelsLoading]);

  useEffect(() => {
    setDailyPosterLayoutData({
      posts: hotPosts.posts,
      farcasterUserData: hotPosts.farcasterUserData,
      topics: topChannels.channels,
      dapps: highScoreDapps.dapps,
      links: topLinks.links,
    });
  }, [
    setDailyPosterLayoutData,
    hotPosts,
    topLinks,
    highScoreDapps,
    topChannels,
  ]);

  return (
    <HomeLayout
      hotPosts={hotPosts}
      topLinks={topLinks}
      topChannels={topChannels}
      highScoreDapps={highScoreDapps}
      hotCommunities={hotCommunities}
    />
  );
}
