import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  URLSearchParamsInit,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import EventExploreList from '../../components/news/event/EventExploreList';
import EventExploreListFilter, {
  EventExploreListFilterValues,
} from '../../components/news/event/EventExploreListFilter';
import { MainWrapper } from '../../components/layout/Index';
import ListScrollBox from '../../components/common/box/ListScrollBox';
import {
  fetchEventExploreList,
  fetchMoreEventExploreList,
  selectAll,
  selectState,
} from '../../features/news/eventExploreList';
import { AsyncRequestStatus } from '../../services/shared/types';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import Loading from '../../components/common/loading/Loading';
import NoResult from '../../components/layout/NoResult';
import FeedsFilterBox from '../../components/news/header/FilterBox';
import SearchInput from '../../components/common/input/SearchInput';
import EventOrderBySelect, {
  defaultEventOrderBy,
} from '../../components/news/event/EventOrderBySelect';
import EventExploreGridList from '../../components/news/event/EventExploreGridList';
import EventPreviewModal from '../../components/news/event/EventPreviewModal';
import {
  Layout,
  getEventsLayoutFromLocal,
  setEventsLayoutToLocal,
} from '../../utils/news/localLayout';
import EventPreview from '../../components/news/event/EventPreview';
import useLogin from '../../hooks/shared/useLogin';
import NewsMenu from '../../components/news/header/NewsMenu';
import NewsToolbar from '../../components/news/header/NewsToolbar';

const isUUid = (str: string) => {
  return str.indexOf('-') > -1;
};

const filterValuesToSearchParams = (values: EventExploreListFilterValues) => {
  return {
    platforms: values.platforms.join(','),
    rewards: values.rewards.join(','),
    eventTypes: values.eventTypes.join(','),
    projectTypes: values.projectTypes.join(','),
  };
};
export default function Events() {
  const navigate = useNavigate();
  const { isAdmin } = useLogin();
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { status, moreStatus, noMore } = useAppSelector(selectState);
  const dispatch = useAppDispatch();
  const eventExploreList = useAppSelector(selectAll);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const [isActiveFilter, setIsActiveFilter] = useState(false);
  const [layout, setLayout] = useState(getEventsLayoutFromLocal());
  const [openEventPreviewModal, setOpenEventPreviewModal] = useState(false);

  const currentSearchParams = useMemo(
    () => ({
      orderBy: searchParams.get('orderBy') || defaultEventOrderBy,
      platforms:
        searchParams.get('platform') || searchParams.get('platforms') || '',
      rewards: searchParams.get('reward') || searchParams.get('rewards') || '',
      eventTypes:
        searchParams.get('eventType') || searchParams.get('eventTypes') || '',
      projectTypes:
        searchParams.get('projectType') ||
        searchParams.get('projectTypes') ||
        '',
      keywords: searchParams.get('keywords') || '',
    }),
    [searchParams]
  );
  const filterValues = useMemo(
    () => ({
      platforms: currentSearchParams.platforms.split(','),
      rewards: currentSearchParams.rewards.split(','),
      eventTypes: currentSearchParams.eventTypes.split(','),
      projectTypes: currentSearchParams.projectTypes.split(','),
    }),
    [currentSearchParams]
  );

  const idCache = useRef('');
  useEffect(() => {
    idCache.current = id === ':id' ? '' : id;
  }, [id]);

  useEffect(() => {
    const params = { ...currentSearchParams };
    if (idCache.current) {
      if (isUUid(idCache.current)) {
        Object.assign(params, { uuid: idCache.current });
      } else {
        Object.assign(params, { eventId: Number(idCache.current) });
      }
    }
    dispatch(fetchEventExploreList({ ...params }));
  }, [currentSearchParams]);

  const activeId = useMemo(() => {
    return id === ':id'
      ? eventExploreList[0]?.uuid || eventExploreList[0]?.id
      : id;
  }, [id, eventExploreList]);

  const event = useMemo(
    () =>
      eventExploreList.find(
        (item) => String(item?.uuid || item?.id) === String(activeId)
      ),
    [eventExploreList, activeId]
  );

  const getMore = useCallback(
    () =>
      dispatch(
        fetchMoreEventExploreList({
          ...currentSearchParams,
        })
      ),
    [currentSearchParams]
  );
  const isLoadingMore = useMemo(
    () => moreStatus === AsyncRequestStatus.PENDING,
    [moreStatus]
  );
  const isEmpty = useMemo(() => !eventExploreList.length, [eventExploreList]);

  const renderMoreLoading = useMemo(
    () =>
      isLoadingMore ? (
        <MoreLoading>loading ...</MoreLoading>
      ) : noMore ? (
        <MoreLoading>No other events</MoreLoading>
      ) : null,
    [isLoadingMore, noMore]
  );

  useEffect(() => {
    if (id !== ':id' && event && layout === Layout.GRID) {
      setOpenEventPreviewModal(true);
    } else {
      setOpenEventPreviewModal(false);
    }
  }, [id, event, layout]);

  const resetRouthPath = useCallback(() => {
    navigate(`/events/:id?${searchParams.toString()}`);
  }, [searchParams]);

  useEffect(() => {
    if (!id) {
      resetRouthPath();
    }
  }, [id, resetRouthPath]);

  return (
    <EventsWrapper>
      <NewsMenu />
      <NewsToolbar
        // displayFilterButton
        // isActiveFilter={isActiveFilter}
        // onChangeActiveFilter={setIsActiveFilter}
        orderByEl={
          <EventOrderBySelect
            value={currentSearchParams.orderBy}
            onChange={(value) =>
              setSearchParams({
                ...currentSearchParams,
                orderBy: value,
              } as unknown as URLSearchParamsInit)
            }
          />
        }
        searchEl={
          <SearchInput
            onSearch={(value) =>
              setSearchParams({
                ...currentSearchParams,
                keywords: value,
              } as unknown as URLSearchParamsInit)
            }
          />
        }
        // filterEl={
        //   <FeedsFilterBox open={isActiveFilter}>
        //     <EventExploreListFilter
        //       values={filterValues}
        //       onChange={(values) =>
        //         setSearchParams({
        //           ...currentSearchParams,
        //           ...filterValuesToSearchParams(values),
        //         })
        //       }
        //     />
        //   </FeedsFilterBox>
        // }
        multiLayout
        layout={layout}
        setLayout={(l) => {
          setEventsLayoutToLocal(l);
          setLayout(l);
        }}
        displaySubmitButton={isAdmin}
        submitButtonOnClick={() => {
          navigate('/events/create');
        }}
      />
      <MainBox>
        {(() => {
          if (isLoading) return <Loading />;
          if (isEmpty)
            return (
              <MainBody>
                <NoResult />
              </MainBody>
            );
          if (layout === Layout.LIST) {
            return (
              <MainBody>
                <ListBox onScrollBottom={getMore}>
                  <EventExploreList
                    data={eventExploreList}
                    activeId={activeId}
                    onItemClick={(item) => {
                      navigate(
                        `/events/${
                          item?.id || item?.uuid || ''
                        }?${searchParams.toString()}`
                      );
                    }}
                  />

                  {renderMoreLoading}
                </ListBox>
                <ContentBox>
                  {event ? (
                    <EventPreview
                      data={event}
                      showAdminOps={!event.isForU && isAdmin}
                    />
                  ) : null}
                </ContentBox>
              </MainBody>
            );
          }
          if (layout === Layout.GRID) {
            return (
              <GrideListBox onScrollBottom={getMore}>
                <EventExploreGridList
                  data={eventExploreList}
                  onItemClick={(item) => {
                    navigate(
                      `/events/${
                        item?.id || item?.uuid || ''
                      }?${searchParams.toString()}`
                    );
                  }}
                />

                {renderMoreLoading}
                <EventPreviewModal
                  isOpen={event && openEventPreviewModal}
                  data={event}
                  onClose={() => {
                    resetRouthPath();
                  }}
                  showAdminOps={!event?.isForU && isAdmin}
                />
              </GrideListBox>
            );
          }
          return null;
        })()}
      </MainBox>
    </EventsWrapper>
  );
}
const EventsWrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 0px;
`;
const MainBox = styled.div`
  width: 100%;
  height: 0px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const MainBody = styled.div`
  width: 100%;
  height: 100%;
  background: #1b1e23;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const ListBox = styled(ListScrollBox)`
  width: 360px;
  height: 100%;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  overflow-y: auto;
`;
const GrideListBox = styled(ListScrollBox)`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow-y: auto;
`;
const MoreLoading = styled.div`
  padding: 20px;
  text-align: center;
  color: #748094;
`;
const ContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
