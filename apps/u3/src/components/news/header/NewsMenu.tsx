/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-28 16:23:16
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getRoute, RouteKey } from '../../../route/routes';
import useRoute from '../../../route/useRoute';
import Tab from '../../common/tab/Tab';

const TWITTER_SEARCH_PARAMS = 'includeDomains=twitter.com,x.com';
// const FARCASTER_SEARCH_PARAMS = 'includeDomains=warpcast.com';
// const LENS_SEARCH_PARAMS = 'includeDomains=warpcast.com';
const GITHUB_SEARCH_PARAMS = 'includeDomains=github.com';
const YOUTUBE_SEARCH_PARAMS = 'includeDomains=youtube.com';
const SUBSTACK_SEARCH_PARAMS = 'includeDomains=substack.com';
const HACKER_NEWS_SEARCH_PARAMS = 'includeDomains=ycombinator.com';
const REDDIT_SEARCH_PARAMS = 'includeDomains=reddit.com';
// const FARQUEST_SEARCH_PARAMS = 'includeDomains=far.quest';
const KIWISTAND_SEARCH_PARAMS = 'includeDomains=news.kiwistand.com/';

const FeedsSwitchOptions = [
  {
    label: 'Links',
    value: `${RouteKey.links}`,
  },
  {
    label: 'Twitter Select',
    value: `${RouteKey.links}?${TWITTER_SEARCH_PARAMS}`,
  },
  // {
  //   label: 'Farcaster',
  //   value: `${RouteKey.links}?${FARCASTER_SEARCH_PARAMS}`,
  // },
  //   label: 'Lens',
  //   value: `${RouteKey.links}?${LENS_SEARCH_PARAMS}`,
  // },
  {
    label: 'Github',
    value: `${RouteKey.links}?${GITHUB_SEARCH_PARAMS}`,
  },
  {
    label: 'Youtube',
    value: `${RouteKey.links}?${YOUTUBE_SEARCH_PARAMS}`,
  },
  {
    label: 'Substack',
    value: `${RouteKey.links}?${SUBSTACK_SEARCH_PARAMS}`,
  },
  {
    label: 'Hacker News',
    value: `${RouteKey.links}?${HACKER_NEWS_SEARCH_PARAMS}`,
  },
  {
    label: 'Reddit',
    value: `${RouteKey.links}?${REDDIT_SEARCH_PARAMS}`,
  },
  // {
  //   label: 'Far.quest',
  //   value: `${RouteKey.links}?${FARQUEST_SEARCH_PARAMS}`,
  // },
  {
    label: 'KiWiStand',
    value: `${RouteKey.links}?${KIWISTAND_SEARCH_PARAMS}`,
  },
  {
    label: 'Contents',
    value: RouteKey.contents,
  },
  {
    label: 'Events',
    value: RouteKey.events,
  },
];

export default function NewsMenu() {
  const navigate = useNavigate();
  const { firstRouteMeta } = useRoute();
  const location = useLocation();
  const [tabValue, setTabValue] = useState('');
  useEffect(() => {
    if (location.search) {
      setTabValue(`${RouteKey.links}${decodeURIComponent(location.search)}`);
    } else {
      setTabValue(firstRouteMeta.key);
    }
  }, [location, firstRouteMeta]);
  return (
    <NewsMenuWrapper>
      <TopBox>
        <TabSwitch
          options={FeedsSwitchOptions}
          value={tabValue}
          onChange={(value) => {
            if (value === RouteKey.contents || value === RouteKey.events) {
              navigate(getRoute(value).path);
            } else {
              const path = value.replace(
                `${RouteKey.links}`,
                getRoute(RouteKey.links).path
              );
              navigate(path);
            }
          }}
        />
      </TopBox>
    </NewsMenuWrapper>
  );
}
const NewsMenuWrapper = styled.div`
  width: 100%;
`;
const TopBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid #39424c;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
  height: 72px;
`;
