/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-04 13:03:54
 * @Description: file description
 */
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useRoute from '../../../route/useRoute';
import Tab from '../../common/tab/Tab';

import GithubIcon from './icon/github.png';
import LinksIcon from './icon/links.png';
import XIcon from './icon/x.png';
import YoutubeIcon from './icon/youtube.png';
import ZoraIcon from './icon/zora.png';
import SpotifyIcon from './icon/spotify.png';
import SubstackIcon from './icon/substack.png';
import ParagraphIcon from './icon/paragraph.png';
import MirrorIcon from './icon/mirror.png';

export const LinkGroup = [
  {
    label: 'Links',
    value: `/news/links/all`,
    group: 'all',
    icon: LinksIcon,
  },
  {
    label: 'Twitter Select',
    value: `/news/links/twitter`,
    group: 'twitter',
    includeDomains: ['twitter.com', 'x.com'],
    icon: XIcon,
  },
  {
    label: 'Zora',
    value: `/news/links/zora`,
    group: 'zora',
    includeDomains: ['zora.co'],
    icon: ZoraIcon,
  },
  {
    label: 'Spotify',
    value: `/news/links/spotify`,
    group: 'spotify',
    includeDomains: ['spotify.com'],
    icon: SpotifyIcon,
  },
  {
    label: 'Github',
    value: `/news/links/github`,
    group: 'github',
    includeDomains: ['github.com'],
    icon: GithubIcon,
  },
  {
    label: 'Youtube',
    value: `/news/links/youtube`,
    group: 'youtube',
    includeDomains: ['youtube.com', 'youtu.be'],
    icon: YoutubeIcon,
  },
  {
    label: 'Substack',
    value: `/news/links/substack`,
    group: 'substack',
    includeDomains: ['substack.com'],
    icon: SubstackIcon,
  },
  {
    label: 'Paragraph',
    value: `/news/links/paragraph`,
    group: 'paragraph',
    includeDomains: ['paragraph.xyz'],
    icon: ParagraphIcon,
  },
  {
    label: 'News',
    value: `/news/contents`,
    icon: MirrorIcon,
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
  const listScrollState = useRef({
    isDown: false,
    startX: null,
    scrollLeft: null,
  });
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
          onMouseDown={(e) => {
            listScrollState.current = {
              isDown: true,
              startX: e.pageX - e.currentTarget.offsetLeft,
              scrollLeft: e.currentTarget.scrollLeft,
            };
            e.currentTarget.classList.add('active');
          }}
          onMouseMove={(e) => {
            if (!listScrollState.current.isDown) return;
            e.preventDefault();
            const x = e.pageX - e.currentTarget.offsetLeft;
            const walk = (x - listScrollState.current.startX) * 2;
            e.currentTarget.scrollLeft =
              listScrollState.current.scrollLeft - walk;
          }}
          onMouseUp={(e) => {
            listScrollState.current.isDown = false;
            e.currentTarget.classList.remove('active');
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
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  border-bottom: 1px solid #39424c;
`;
const TabSwitch = styled(Tab)`
  width: 100%;
  border-bottom: none;
  justify-content: flex-start;
  height: 72px;
`;
