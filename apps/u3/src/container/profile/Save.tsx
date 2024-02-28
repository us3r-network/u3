import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { usePersonalFavors } from '@us3r-network/link';
import { isMobile } from 'react-device-detect';
import { uniqBy } from 'lodash';
import { MainWrapper } from '../../components/layout/Index';
import Loading from '../../components/common/loading/Loading';
import PageTitle from '../../components/layout/PageTitle';
import SaveExploreList from '../../components/profile/save/SaveExploreList';
import SaveExploreListMobile from '../../components/profile/save/SaveExploreListMobile';
import {
  getContentLinkDataWithJsonValue,
  getContentPlatformLogoWithJsonValue,
} from '../../utils/news/content';
import { getDappLinkDataWithJsonValue } from '../../utils/dapp/dapp';
import { getEventLinkDataWithJsonValue } from '../../utils/news/event';
import SyncingBotSaves from '@/components/profile/save/SyncingBotSaves';
// import { DappLinkData } from '../services/dapp/types/dapp';
// import { ContentLinkData } from '../services/news/types/contents';
// import { EventLinkData } from '../services/news/types/event';

function EmptyList() {
  return (
    <EmptyBox>
      <EmptyDesc>
        Nothing to see here！ Explore and favorite what you like！
      </EmptyDesc>
    </EmptyBox>
  );
}

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

const EmptyDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;

export default function Save() {
  const { isFetching, personalFavors } = usePersonalFavors();
  const [savedLinks, setSavedLinks] = useState([]);
  // console.log('personalFavors', personalFavors);
  const list = useMemo(
    () => [
      ...savedLinks.map((item) => {
        const createAt = item.createAt || new Date().getTime();
        return { ...item, createAt };
      }),
      ...uniqBy(
        personalFavors
          .filter((item) => !!item?.link && item.link.type !== 'test')
          .map((item) => {
            const { link, createAt } = item;
            let linkData;
            let title = '';
            let logo = '';
            switch (link.type) {
              case 'dapp':
                linkData = getDappLinkDataWithJsonValue(link?.data);
                title = linkData?.name || link.title;
                logo = linkData?.image || '';
                break;
              case 'content':
                linkData = getContentLinkDataWithJsonValue(link?.data);
                title = linkData?.title || link.title;
                logo =
                  getContentPlatformLogoWithJsonValue(linkData?.value) ||
                  linkData?.platform?.logo ||
                  '';
                break;
              case 'event':
                linkData = getEventLinkDataWithJsonValue(link?.data);
                title = linkData?.name || link.title;
                logo = linkData?.image || linkData?.platform?.logo || '';
                break;
              default:
                linkData = JSON.parse(link?.data);
                title = linkData?.title || link.title;
                logo = linkData?.image || '';
                break;
            }
            return { ...link, id: link.id, title, logo, createAt };
          }),
        'id'
      ),
    ],
    [personalFavors, savedLinks]
  );
  const isEmpty = useMemo(() => list.length === 0, [list]);
  return (
    <Wrapper>
      {isMobile ? null : <PageTitle>Saves</PageTitle>}
      <SyncingBotSaves
        onComplete={(saves) => {
          console.log('onComplete SyncingBotSaves');
          setSavedLinks(saves);
        }}
      />
      <ContentWrapper>
        {isFetching ? (
          <Loading />
        ) : isEmpty ? (
          <EmptyList />
        ) : isMobile ? (
          <SaveExploreListMobile
            data={list}
            onItemClick={(item) => {
              window.open(item.url, '_blank');
            }}
          />
        ) : (
          <div className="w-full h-full">
            <SaveExploreList
              data={list}
              onItemClick={(item) => {
                window.open(item.url, '_blank');
              }}
            />
          </div>
        )}
      </ContentWrapper>
    </Wrapper>
  );
}

const Wrapper = styled(MainWrapper)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ContentWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;
