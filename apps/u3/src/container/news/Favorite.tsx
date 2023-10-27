/* eslint-disable react/no-unescaped-entities */
import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import ScrollBox from '../../components/common/box/ScrollBox';
import Tab from '../../components/common/tab/Tab';
import ContentList from '../../components/news/contents/ContentList';
import EventExploreList, {
  EventExploreListItemData,
} from '../../components/news/event/EventExploreList';
import EventLinkPreview from '../../components/news/event/EventLinkPreview';
import { MainWrapper } from '../../components/layout/Index';
import {
  ContentsEntityItem,
  selectState,
} from '../../features/shared/userGroupFavorites';
import { useAppSelector } from '../../store/hooks';
import { AsyncRequestStatus } from '../../services/shared/types';
import Loading from '../../components/common/loading/Loading';
import useContentHandles from '../../hooks/news/useContentHandles';
import { ContentListItem } from '../../services/news/types/contents';
import TwoHeartSvg from '../../components/common/assets/imgs/two-heart.svg';
import { ButtonPrimaryLine } from '../../components/common/button/ButtonBase';
import ContentPreview from '../../components/news/contents/ContentPreview';
import PageTitle from '../../components/layout/PageTitle';
import ButtonBack from '../../components/common/button/ButtonBack';
import usePersonalFavorsLinkData from '../../hooks/shared/usePersonalFavorsLinkData';

function EmptyFavorites() {
  const navigate = useNavigate();
  return (
    <EmptyContentWrapper>
      <EmptyBox>
        <EmptyImg src={TwoHeartSvg} />
        <EmptyDesc>
          Nothing to see here！ Explore and favorite what you like！
        </EmptyDesc>
        <ButtonPrimaryLine onClick={() => navigate('/events')}>
          Explore
        </ButtonPrimaryLine>
      </EmptyBox>
    </EmptyContentWrapper>
  );
}
function EmptyList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        Nothing to see here！ Explore and favorite what you like！
      </EmptyDesc>
    </EmptyBox>
  );
}
function EmptyContent() {
  return (
    <EmptyBox>
      <EmptyImg src={TwoHeartSvg} />
    </EmptyBox>
  );
}

const EmptyContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1b1e23;
`;
const EmptyBox = styled.div`
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  background-color: #1b1e23;
`;
const EmptyImg = styled.img`
  width: 100px;
  height: 100px;
`;
const EmptyDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;

enum FavoriteSwitchValue {
  event = 'event',
  content = 'content',
}
export const FavoriteSwitchOptions = [
  {
    label: 'Content',
    value: FavoriteSwitchValue.content,
  },
  {
    label: 'Event',
    value: FavoriteSwitchValue.event,
  },
];

function Favorite() {
  const navigate = useNavigate();
  const { personalContents, personalEvents } = usePersonalFavorsLinkData();

  const [showContentList, setShowContentList] = useState<ContentListItem[]>([]);
  useEffect(() => {
    setShowContentList(personalContents as unknown as ContentListItem[]);
  }, [personalContents]);
  const { onHiddenUndoAction: onContentHiddenUndoAction } = useContentHandles(
    showContentList,
    setShowContentList
  );
  const { status } = useAppSelector(selectState);
  const isLoading = useMemo(
    () => status === AsyncRequestStatus.PENDING,
    [status]
  );
  const isEmptyEvents = useMemo(() => !personalEvents.length, [personalEvents]);
  const isEmptyContents = useMemo(
    () => !personalContents.length,
    [personalContents]
  );
  const isEmpty = useMemo(
    () => isEmptyEvents && isEmptyContents,
    [isEmptyEvents, isEmptyContents]
  );
  const [event, setEvent] = useState<EventExploreListItemData | null>(null);
  const [content, setContent] = useState<ContentsEntityItem | null>(null);
  const [switchValue, setSwitchValue] = useState<FavoriteSwitchValue>(
    FavoriteSwitchValue.content
  );

  return (
    <Wrapper>
      <Header>
        <ButtonBack onClick={() => navigate('/web3-today')} />
        <PageTitle>Favorite</PageTitle>
      </Header>

      <ContentWrapper>
        {isLoading ? (
          <Loading />
        ) : (
          <FavoritesLayout>
            {isEmpty ? (
              <EmptyFavorites />
            ) : (
              <>
                <FavoritesListBox>
                  <FavoritesListHeader>
                    <TabSwitch
                      options={FavoriteSwitchOptions}
                      value={switchValue}
                      onChange={(value) => setSwitchValue(value)}
                    />
                  </FavoritesListHeader>
                  {switchValue === FavoriteSwitchValue.event &&
                    (isEmptyEvents ? (
                      <EmptyList />
                    ) : (
                      <FavoritesList>
                        <EventExploreList
                          data={
                            personalEvents as unknown as EventExploreListItemData[]
                          }
                          activeId={event?.id || 0}
                          onItemClick={setEvent}
                        />
                      </FavoritesList>
                    ))}
                  {switchValue === FavoriteSwitchValue.content &&
                    (isEmptyContents ? (
                      <EmptyList />
                    ) : (
                      <FavoritesList>
                        <ContentList
                          data={showContentList}
                          activeId={content?.id}
                          onHiddenUndo={onContentHiddenUndoAction}
                          onItemClick={(item) =>
                            setContent(item as unknown as ContentListItem)
                          }
                        />
                      </FavoritesList>
                    ))}
                </FavoritesListBox>
                <FavoritesContentBox>
                  {FavoriteSwitchValue.event === switchValue &&
                    (event ? (
                      <EventLinkPreview data={event} />
                    ) : (
                      <EmptyContent />
                    ))}

                  {switchValue === FavoriteSwitchValue.content &&
                    (content ? (
                      <ContentPreview data={content} showAdminOps={false} />
                    ) : (
                      <EmptyContent />
                    ))}
                </FavoritesContentBox>
              </>
            )}
          </FavoritesLayout>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}
export default Favorite;

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const FavoritesLayout = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid #39424c;
  box-sizing: border-box;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
`;
const FavoritesListBox = styled.div`
  width: 360px;
  height: 100%;
  background: #1b1e23;
  border-right: 1px solid #39424c;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;
const FavoritesListHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 32px;
  border-bottom: 1px solid #39424c;
  padding: 0 20px;
  box-sizing: border-box;
`;
const TabSwitch = styled(Tab)`
  flex: 1;
  border-bottom: none;
  justify-content: flex-start;
`;
const FavoritesList = styled(ScrollBox)`
  width: 100%;
  height: 0px;
  flex: 1;
`;
const FavoritesContentBox = styled.div`
  width: 0;
  flex: 1;
  height: 100%;
`;
