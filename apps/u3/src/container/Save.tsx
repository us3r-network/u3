import { useMemo } from 'react';
import styled from 'styled-components';
import { usePersonalFavors } from '@us3r-network/link';
import { isMobile } from 'react-device-detect';

import { MainWrapper } from '../components/layout/Index';
import Loading from '../components/common/loading/Loading';
import PageTitle from '../components/common/PageTitle';
import SaveExploreList from '../components/save/SaveExploreList';
import SaveExploreListMobile from '../components/save/SaveExploreListMobile';
import {
  getContentLinkDataWithJsonValue,
  getContentPlatformLogoWithJsonValue,
} from '../utils/content';
import { getDappLinkDataWithJsonValue } from '../utils/dapp';
import { getEventLinkDataWithJsonValue } from '../utils/event';
import { DappLinkData } from '../services/types/dapp';
import { ContentLinkData } from '../services/types/contents';
import { EventLinkData } from '../services/types/event';

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

  const list = personalFavors
    .filter((item) => !!item?.link)
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
          break;
      }
      return { ...link, id: link.id, title, logo, createAt };
    });
  const isEmpty = useMemo(() => list.length === 0, [list]);

  return (
    <Wrapper>
      {isMobile ? null : <PageTitle>Saves</PageTitle>}
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
          <SaveExploreList
            data={list}
            onItemClick={(item) => {
              window.open(item.url, '_blank');
            }}
          />
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
