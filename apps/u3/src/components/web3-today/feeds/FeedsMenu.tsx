/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-20 12:01:51
 * @Description: file description
 */
import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { getRoute, RouteKey } from '../../../route/routes';
import useRoute from '../../../route/useRoute';
import Tab from '../../common/tab/Tab';
import ButtonBack from '../../common/button/ButtonBack';

const TWITTER_SEARCH_PARAMS =
  'includeDomains=https://twitter.com,https://x.com';
const OTHER_SEARCH_PARAMS = 'excludeDomains=https://twitter.com,https://x.com';

const FeedsSwitchOptions = [
  {
    label: 'Twitter Select',
    value: `${RouteKey.links}?${TWITTER_SEARCH_PARAMS}`,
  },
  {
    label: 'Links',
    value: `${RouteKey.links}?${OTHER_SEARCH_PARAMS}`,
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
type FeedsMenuProps = StyledComponentPropsWithRef<'div'> & {
  rightEl?: ReactNode;
  bottomEl?: ReactNode;
};
export default function FeedsMenu({ rightEl, bottomEl }: FeedsMenuProps) {
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
    <FeedsMenuWrapper>
      <TopBox>
        <LeftBox>
          <ButtonBack onClick={() => navigate('/web3-today')} />
          <TabSwitch
            options={FeedsSwitchOptions}
            value={tabValue}
            onChange={(value) => {
              switch (value) {
                case FeedsSwitchOptions[0].value:
                  navigate(
                    `${getRoute(RouteKey.links).path}?${TWITTER_SEARCH_PARAMS}`
                  );
                  break;
                case FeedsSwitchOptions[1].value:
                  navigate(
                    `${getRoute(RouteKey.links).path}?${OTHER_SEARCH_PARAMS}`
                  );
                  break;
                default:
                  navigate(getRoute(value).path);
              }
            }}
          />
        </LeftBox>
        {rightEl && <RightBox>{rightEl}</RightBox>}
      </TopBox>
      {bottomEl}
    </FeedsMenuWrapper>
  );
}
const FeedsMenuWrapper = styled.div`
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
