import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { usePersonalFavors } from '@us3r-network/link';
import { uniqBy } from 'lodash';
import { useMemo, useState } from 'react';
import Loading from '@/components/common/loading/Loading';
import { MainWrapper } from '@/components/layout/Index';
import SaveExploreList from '@/components/profile/save/FavList';
import SyncingBotSaves from '@/components/profile/save/SyncingBotSaves';
import { Tabs } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
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
  const { isFetching, personalFavors } = usePersonalFavors();
  const [savedLinks, setSavedLinks] = useState([]);
  const [type, setType] = useState(FavType.Post);
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
        <Tabs
          className="h-full items-start"
          value={type}
          onValueChange={(v) => {
            setType(v as FavType);
          }}
        >
          <TabsList className="flex gap-5 justify-start w-full bg-inherit">
            <TabsTrigger
              value={FavType.Post}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit text-gray-400 data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Posts`}
            </TabsTrigger>
            <TabsTrigger
              value={FavType.Link}
              className={cn(
                'border-[#1B1E23] border-b-2 px-0 pb-2 text-base rounded-none data-[state=active]:bg-inherit text-gray-400 data-[state=active]:text-white data-[state=active]:border-white'
              )}
            >
              {`Links`}
            </TabsTrigger>
          </TabsList>
          <TabsContent
            id="profile-contacts-following-warper"
            value={FavType.Post}
            className="h-full"
          >
            {' '}
            <SaveExploreList
              data={list.filter((item) => item.type === FavType.Post)}
              onItemClick={(item) => {
                window.open(item.url, '_blank');
              }}
            />
          </TabsContent>
          <TabsContent
            id="profile-contacts-follower-warper"
            value={FavType.Link}
            className="h-full"
          >
            <SaveExploreList
              data={list.filter((item) => item.type === FavType.Link)}
              onItemClick={(item) => {
                window.open(item.url, '_blank');
              }}
            />
          </TabsContent>
        </Tabs>
      )}
    </MainWrapper>
  );
}
