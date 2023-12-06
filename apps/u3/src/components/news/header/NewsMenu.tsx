/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 15:59:03
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
    label: 'Twitter',
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
    icon: LinksIcon,
  },
  {
    label: 'Mirror',
    value: `/news/links/mirror`,
    group: 'mirror',
    includeDomains: ['mirror.xyz'],
    icon: 'https://mirror.xyz/icon/favicon-32x32.png',
  },
  {
    label: 'Aburra',
    value: `/news/links/aburra`,
    group: 'aburra',
    includeDomains: ['aburra.xyz'],
    icon: 'https://aburra.xyz/favicon.ico',
  },
  {
    label: 'Launchcaster',
    value: `/news/links/launchcaster`,
    group: 'launchcaster',
    includeDomains: ['launchcaster.xyz'],
    icon: 'https://www.launchcaster.xyz/favicon.ico',
  },
  {
    label: 'Kiwistand',
    value: `/news/links/kiwistand`,
    group: 'kiwistand',
    includeDomains: ['news.kiwistand.com'],
    icon: 'https://news.kiwistand.com/favicon.ico',
  },
  {
    label: 'Weponder',
    value: `/news/links/weponder`,
    group: 'weponder',
    includeDomains: ['weponder.io'],
    icon: 'https://weponder.io/favicon.ico',
  },
  {
    label: 'Unlonely',
    value: `/news/links/unlonely`,
    group: 'unlonely',
    includeDomains: ['unlonely.app'],
    icon: 'https://unlonely.app/images/favicon-32x32.png',
  },
  {
    label: 'Bountycaster',
    value: `/news/links/bountycaster`,
    group: 'bountycaster',
    includeDomains: ['bountycaster.xyz'],
    icon: 'https://bountycaster.xyz/static/favicons/apple-touch-icon.png',
  },
  {
    label: 'tiles',
    value: `/news/links/tiles`,
    group: 'tiles',
    includeDomains: ['tiles.cool'],
    icon: 'https://www.tiles.cool/favicon.ico',
  },
  {
    label: 'Far.quest',
    value: `/news/links/far.quest`,
    group: 'far.quest',
    includeDomains: ['far.quest'],
    icon: 'https://far.quest/favicon.ico',
  },
  {
    label: 'Withfabric',
    value: `/news/links/withfabric`,
    group: 'withfabric',
    includeDomains: ['withfabric.xyz'],
    icon: 'https://withfabric.xyz/favicon.ico',
  },
  {
    label: 'Arxiv',
    value: `/news/links/arxiv`,
    group: 'arxiv',
    includeDomains: ['arxiv.org'],
    icon: 'https://arxiv.org/favicon.ico',
  },
  {
    label: 'Basepaint',
    value: `/news/links/basepaint`,
    group: 'basepaint',
    includeDomains: ['basepaint.xyz'],
    icon: 'https://basepaint.xyz/favicon.ico',
  },
  {
    label: 'Warpcast',
    value: `/news/links/warpcast`,
    group: 'warpcast',
    includeDomains: ['warpcast.com'],
    icon: 'https://warpcast.com/favicon.ico',
  },
  {
    label: 'Flink',
    value: `/news/links/flink`,
    group: 'flink',
    includeDomains: ['flink.fyi'],
    icon: 'https://flink.fyi/favicon.ico',
  },
  {
    label: 'Mint.fun',
    value: `/news/links/mint.fun`,
    group: 'mint.fun',
    includeDomains: ['mint.fun'],
    icon: 'https://mint.fun/favicon.ico',
  },
  {
    label: 'Vercel',
    value: `/news/links/vercel`,
    group: 'vercel',
    includeDomains: ['vercel.app'],
    icon: 'https://vercel.com/favicon.ico',
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
