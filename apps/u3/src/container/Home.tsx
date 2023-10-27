/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-11-29 17:59:06
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-07 15:52:58
 * @Description: file description
 */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/common/loading/Loading';
import Carousel from '../components/home/Carousel';
import DiscoverProj from '../components/home/DiscoverProj';
import Platform from '../components/home/Platform';
import RecommendContent from '../components/home/RecommendContent';
import RecommendContentMobile from '../components/home/RecommendContentMobile';
import RecommendEvents from '../components/home/RecommendEvents';

import Poster from '../components/home/Poster';
import { MainWrapper } from '../components/layout/Index';
import { selectWebsite } from '../features/shared/websiteSlice';
import useConfigsPlatforms from '../hooks/shared/useConfigsPlatforms';
import {
  getTrendingDapps,
  getTrendingEvents,
  getTrendingContents,
} from '../services/shared/api/home';
import { ContentListItem } from '../services/news/types/contents';
import { EventExploreListItemResponse } from '../services/news/types/event';

import { DappExploreListItemResponse } from '../services/dapp/types/dapp';
import { useAppSelector } from '../store/hooks';
import PopularDappsMobile from '../components/home/PopularDappsMobile';
import RecommendEventMobile from '../components/home/RecommendEventsMobile';

function Home() {
  const { homeBannerDisplay } = useAppSelector(selectWebsite);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { platforms } = useConfigsPlatforms();
  const showPlatforms = useMemo(
    () => platforms.filter((item) => !!item.number).slice(0, 16),
    [platforms]
  );
  const [trendingDapps, setTrendingDapps] = useState<
    Array<DappExploreListItemResponse>
  >([]);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);
  const recommendEvents = events.slice(0, 8);
  // const trendingEvents = events.slice(-6);

  const loadDapps = useCallback(async () => {
    const { data } = await getTrendingDapps();
    setTrendingDapps(data.data);
  }, []);
  const loadContents = useCallback(async () => {
    const { data } = await getTrendingContents();
    // 按总体分值排序
    const sortData = [...(data?.data || [])].sort((a, b) => {
      const aScore = Number(a?.upVoteNum) + Number(a?.editorScore);
      const bScore = Number(b?.upVoteNum) + Number(b?.editorScore);
      return bScore - aScore;
    });
    setContents(sortData);
  }, []);
  const loadEvents = useCallback(async () => {
    const { data } = await getTrendingEvents();
    setEvents(data.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([loadEvents(), loadContents(), loadDapps()]).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <HomeWrapper>
      {!isMobile && homeBannerDisplay && <Carousel />}
      {(loading && (
        <div className="loading">
          <Loading />
        </div>
      )) || (
        <>
          {isMobile && (
            <>
              <RecommendContentMobile
                data={contents}
                viewAllAction={() => {
                  navigate('/contents');
                }}
              />
              <PopularDappsMobile
                data={trendingDapps}
                viewAllAction={() => navigate('/dapp-store')}
              />
              <RecommendEventMobile data={recommendEvents} />
            </>
          )}

          {!isMobile && (
            <>
              <div className="row-2">
                <div className="left">
                  <RecommendContent
                    data={contents}
                    viewAllAction={() => {
                      navigate('/contents');
                    }}
                  />
                </div>
                <div className="right">
                  <DiscoverProj
                    data={trendingDapps}
                    viewAllAction={() => {
                      navigate('/dapp-store');
                    }}
                  />
                </div>
              </div>

              <RecommendEvents
                data={recommendEvents}
                viewAllAction={() => {
                  navigate('/events');
                }}
              />
              <Platform
                platforms={showPlatforms}
                viewAllAction={() => {
                  navigate('/events');
                }}
              />
            </>
          )}

          <Poster
            data={{
              contents,
              dapps: trendingDapps,
              // dapps: trendingProjects,
              events: recommendEvents,
            }}
            isMobile={isMobile}
          />
        </>
      )}
    </HomeWrapper>
  );
}
export default Home;
const HomeWrapper = styled(MainWrapper)`
  min-height: 100vh;
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 40px;
  ${isMobile &&
  `
    gap: 20px;
  `}
  & div.loading {
    height: 0;
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & div.row-2 {
    display: flex;
    gap: 20px;
    .left {
      flex: 3;
    }
    .right {
      flex: 1;
    }
  }
`;
