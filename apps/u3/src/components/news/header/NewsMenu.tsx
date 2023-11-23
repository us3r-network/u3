/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-22 18:28:51
 * @Description: file description
 */
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { getRoute, RouteKey } from '../../../route/routes';
import useRoute from '../../../route/useRoute';
import Tab from '../../common/tab/Tab';

const TWITTER_SEARCH_PARAMS = 'includeDomains=twitter.com,x.com';
const FARCASTER_SEARCH_PARAMS = 'includeDomains=warpcast.com';
const GITHUB_SEARCH_PARAMS = 'includeDomains=github.com';
const YOUTUBE_SEARCH_PARAMS = 'includeDomains=youtube.com';
// const HACKER_NEWS_SEARCH_PARAMS = 'includeDomains=ycombinator.com';
// const REDDIT_SEARCH_PARAMS = 'includeDomains=reddit.com';

const FeedsSwitchOptions = [
  {
    label: 'Links',
    value: `${RouteKey.links}`,
  },
  {
    label: 'Twitter Select',
    value: `${RouteKey.links}?${TWITTER_SEARCH_PARAMS}`,
  },
  {
    label: 'Farcaster',
    value: `${RouteKey.links}?${FARCASTER_SEARCH_PARAMS}`,
  },
  {
    label: 'Github',
    value: `${RouteKey.links}?${GITHUB_SEARCH_PARAMS}`,
  },
  {
    label: 'Youtube',
    value: `${RouteKey.links}?${YOUTUBE_SEARCH_PARAMS}`,
  },
  // {
  //   label: 'Hacker News',
  //   value: `${RouteKey.links}?${HACKER_NEWS_SEARCH_PARAMS}`,
  // },
  // {
  //   label: 'Reddit',
  //   value: `${RouteKey.links}?${REDDIT_SEARCH_PARAMS}`,
  // },
  {
    label: 'Contents',
    value: RouteKey.contents,
  },
  {
    label: 'Events',
    value: RouteKey.events,
  },
];
type NewsMenuProps = StyledComponentPropsWithRef<'div'> & {
  rightEl?: ReactNode;
  bottomEl?: ReactNode;
};
export default function NewsMenu({ rightEl, bottomEl }: NewsMenuProps) {
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
        <LeftBox>
          <TabSwitch
            options={FeedsSwitchOptions}
            value={tabValue}
            onChange={(value) => {
              switch (value) {
                case FeedsSwitchOptions[0].value:
                  navigate(`${getRoute(RouteKey.links).path}`);
                  break;
                case FeedsSwitchOptions[1].value:
                  navigate(
                    `${getRoute(RouteKey.links).path}?${TWITTER_SEARCH_PARAMS}`
                  );
                  break;
                case FeedsSwitchOptions[2].value:
                  navigate(
                    `${
                      getRoute(RouteKey.links).path
                    }?${FARCASTER_SEARCH_PARAMS}`
                  );
                  break;
                case FeedsSwitchOptions[3].value:
                  navigate(
                    `${getRoute(RouteKey.links).path}?${GITHUB_SEARCH_PARAMS}`
                  );
                  break;
                case FeedsSwitchOptions[4].value:
                  navigate(
                    `${getRoute(RouteKey.links).path}?${YOUTUBE_SEARCH_PARAMS}`
                  );
                  break;
                // case FeedsSwitchOptions[5].value:
                //   navigate(
                //     `${
                //       getRoute(RouteKey.links).path
                //     }?${HACKER_NEWS_SEARCH_PARAMS}`
                //   );
                //   break;
                // case FeedsSwitchOptions[6].value:
                //   navigate(
                //     `${getRoute(RouteKey.links).path}?${REDDIT_SEARCH_PARAMS}`
                //   );
                //   break;
                default:
                  navigate(getRoute(value).path);
              }
            }}
          />
        </LeftBox>
        {rightEl && <RightBox>{rightEl}</RightBox>}
      </TopBox>
      {bottomEl}
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
const LeftBox = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
`;
const TabSwitch = styled(Tab)`
  border-bottom: none;
  justify-content: flex-start;
  height: 72px;
`;
const RightBox = styled.div`
  flex: 1;
`;