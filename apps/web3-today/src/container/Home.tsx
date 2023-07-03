import { useState, useCallback, useEffect, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Loading from '../components/common/loading/Loading';
import Platform from '../components/home/Platform';
import RecommendContent from '../components/home/RecommendContent';
import RecommendContentMobile from '../components/home/RecommendContentMobile';
import RecommendEvents from '../components/home/RecommendEvents';
import Poster from '../components/home/Poster';
import { MainWrapper } from '../components/layout/Index';
import useConfigsPlatforms from '../hooks/useConfigsPlatforms';
import { getTrendingEvents, getTrendingContents } from '../services/api/home';
import { ContentListItem } from '../services/types/contents';
import { EventExploreListItemResponse } from '../services/types/event';
import RecommendEventMobile from '../components/home/RecommendEventsMobile';
import Header from '../components/home/Header';

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { platforms } = useConfigsPlatforms();
  const showPlatforms = useMemo(
    () => platforms.filter((item) => !!item.number).slice(0, 16),
    [platforms]
  );

  const [contents, setContents] = useState<Array<ContentListItem>>([]);
  const [events, setEvents] = useState<Array<EventExploreListItemResponse>>([]);
  const recommendEvents = events.slice(0, 4);

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
    Promise.all([loadEvents(), loadContents()]).finally(() => {
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
              events: recommendEvents,
            }}
            isMobile={isMobile}
          />
        </>
      )}
    </Wrapper>
  );
}
export default Home;
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
