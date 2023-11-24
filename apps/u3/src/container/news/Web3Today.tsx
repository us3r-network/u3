import { useState, useCallback, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../../components/common/loading/Loading';
import Platform from '../../components/web3-today/Platform';
import RecommendContent from '../../components/web3-today/RecommendContent';
import RecommendContentMobile from '../../components/web3-today/RecommendContentMobile';
import RecommendEvents from '../../components/web3-today/RecommendEvents';
import Poster from '../../components/web3-today/Poster';
import { MainWrapper } from '../../components/layout/Index';
import useConfigsPlatforms from '../../hooks/shared/useConfigsPlatforms';
import {
  getTrendingDapps,
  getTrendingEvents,
  getTrendingContents,
} from '../../services/shared/api/home';
import { ContentListItem } from '../../services/news/types/contents';
import { EventExploreListItemResponse } from '../../services/news/types/event';
import { DappExploreListItemResponse } from '../../services/dapp/types/dapp';
import RecommendEventMobile from '../../components/web3-today/RecommendEventsMobile';
import Header from '../../components/web3-today/Header';

function Web3Today() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { platforms, loading: platformsLoading } = useConfigsPlatforms();
  const showPlatforms = useMemo(
    () => platforms.filter((item) => !!item.number).slice(0, 16),
    [platforms]
  );
  const [trendingDapps, setTrendingDapps] = useState<
    Array<DappExploreListItemResponse>
  >([]);
  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);
  const recommendEvents = events.slice(0, 4);

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
    <Wrapper>
      {!isMobile && <Header />}
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
                  <RecommendEvents
                    data={recommendEvents}
                    viewAllAction={() => {
                      navigate('/events');
                    }}
                  />
                </div>
              </div>

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
              events: recommendEvents,
            }}
            isMobile={isMobile}
          />
        </>
      )}
    </Wrapper>
  );
}
export default Web3Today;
const Wrapper = styled(MainWrapper)`
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
      flex: 2;
    }
    .right {
      flex: 1;
    }
  }
`;
