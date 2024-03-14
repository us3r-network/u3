import { usePersonalFavors } from '@us3r-network/link';
import { uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Loading from '@/components/common/loading/Loading';
import { MainWrapper } from '@/components/layout/Index';
import SaveExploreList from '@/components/profile/save/FavList';
import SyncingBotSaves from '@/components/profile/save/SyncingBotSaves';
import { getDappLinkDataWithJsonValue } from '@/utils/dapp/dapp';
import {
  getContentLinkDataWithJsonValue,
  getContentPlatformLogoWithJsonValue,
} from '@/utils/news/content';
import { getEventLinkDataWithJsonValue } from '@/utils/news/event';

enum FavType {
  Link = 'link',
  Dapp = 'dapp',
  Content = 'content',
  Event = 'event',
  Post = 'post',
}
export default function Fav() {
  const { pathname } = useLocation();

  const { isFetching, personalFavors } = usePersonalFavors();
  const [savedLinks, setSavedLinks] = useState([]);
  const type = useMemo(() => {
    if (pathname.includes('dapps')) return FavType.Dapp;
    if (pathname.includes('contents')) return FavType.Content;
    if (pathname.includes('events')) return FavType.Event;
    if (pathname.includes('posts')) return FavType.Post;
    if (pathname.includes('links')) return FavType.Link;
    return '';
  }, [pathname]);
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
  return (
    <MainWrapper className="flex flex-col gap-4">
      <SyncingBotSaves
        onComplete={(saves) => {
          console.log('onComplete SyncingBotSaves');
          setSavedLinks(saves);
        }}
      />
      {isFetching ? (
        <div className="flex items-center justify-center">
          <Loading />
        </div>
      ) : (
        <SaveExploreList
          data={list.filter((item) => (type ? item.type === type : true))}
          onItemClick={(item) => {
            window.open(item.url, '_blank');
          }}
        />
      )}
    </MainWrapper>
  );
}
