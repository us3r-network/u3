/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-01 18:14:02
 * @Description: file description
 */
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useRoute from '../../../route/useRoute';
import Tab from '../../common/tab/Tab';

export const LinkGroup = [
  {
    label: 'Links',
    value: `/news/links/all`,
    group: 'all',
  },
  {
    label: 'Twitter Select',
    value: `/news/links/twitter`,
    group: 'twitter',
    includeDomains: ['twitter.com', 'x.com'],
  },
  {
    label: 'Zora',
    value: `/news/links/zora`,
    group: 'zora',
    includeDomains: ['zora.co'],
  },
  {
    label: 'Spotify',
    value: `/news/links/spotify`,
    group: 'spotify',
    includeDomains: ['spotify.com'],
  },
  {
    label: 'Github',
    value: `/news/links/github`,
    group: 'github',
    includeDomains: ['github.com'],
  },
  {
    label: 'Youtube',
    value: `/news/links/youtube`,
    group: 'youtube',
    includeDomains: ['youtube.com', 'youtu.be'],
  },
  {
    label: 'Substack',
    value: `/news/links/substack`,
    group: 'substack',
    includeDomains: ['substack.com'],
  },
  {
    label: 'Paragraph',
    value: `/news/links/paragraph`,
    group: 'paragraph',
    includeDomains: ['paragraph.xyz'],
  },
  {
    label: 'Contents',
    value: `/news/contents`,
  },
  // {
  //   label: 'Events',
  //   value: `/news/events`,
  // },
];

export default function NewsMenu() {
  const navigate = useNavigate();
  const { lastRouteMeta } = useRoute();
  const location = useLocation();
  const [tabValue, setTabValue] = useState('');
  useEffect(() => {
    const activeOption =
      LinkGroup.find((item) => location.pathname.indexOf(item.value) >= 0) ||
      LinkGroup[0];
    if (activeOption) setTabValue(activeOption.value);
  }, [location, lastRouteMeta]);
  return (
    <NewsMenuWrapper>
      <TopBox>
        <TabSwitch
          options={LinkGroup}
          value={tabValue}
          onChange={(value) => {
            navigate(value);
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
