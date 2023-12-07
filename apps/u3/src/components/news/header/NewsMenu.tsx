/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-03 16:10:28
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-07 15:29:25
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
import AburraIcon from './icon/aburra.png';
import ArxivIcon from './icon/arxiv.png';
import BasepaintIcon from './icon/basepaint.png';
import BountycasterIcon from './icon/bountycaster.png';
import FarQuestIcon from './icon/farquest.png';
import FlinkIcon from './icon/flink.png';
import KiwistandIcon from './icon/kiwistand.png';
import LaunchcasterIcon from './icon/launchcaster.png';
import MintFunIcon from './icon/mintfun.png';
import MirrorIcon from './icon/mirror.png';
import TilesIcon from './icon/tiles.png';
import UnlonelyIcon from './icon/unlonely.png';
import VercelIcon from './icon/vercel.png';
import WarpcastIcon from './icon/warpcast.png';
import WeponderIcon from './icon/weponder.png';
import WithfabricIcon from './icon/withfabric.png';
import NewsIcon from './icon/news.png';

const LINKS_ROUTE_PREFIX = '/b/links';
const CONTENTS_ROUTE = '/b/contents';
export const LinkGroup = [
  {
    label: 'Links',
    value: `${LINKS_ROUTE_PREFIX}/all`,
    group: 'all',
    icon: LinksIcon,
  },
  {
    label: 'Twitter',
    value: `${LINKS_ROUTE_PREFIX}/twitter`,
    group: 'twitter',
    includeDomains: ['twitter.com', 'x.com'],
    icon: XIcon,
  },
  {
    label: 'Zora',
    value: `${LINKS_ROUTE_PREFIX}/zora`,
    group: 'zora',
    includeDomains: ['zora.co'],
    icon: ZoraIcon,
  },
  {
    label: 'Spotify',
    value: `${LINKS_ROUTE_PREFIX}/spotify`,
    group: 'spotify',
    includeDomains: ['spotify.com'],
    icon: SpotifyIcon,
  },
  {
    label: 'Github',
    value: `${LINKS_ROUTE_PREFIX}/github`,
    group: 'github',
    includeDomains: ['github.com'],
    icon: GithubIcon,
  },
  {
    label: 'Youtube',
    value: `${LINKS_ROUTE_PREFIX}/youtube`,
    group: 'youtube',
    includeDomains: ['youtube.com', 'youtu.be'],
    icon: YoutubeIcon,
  },
  {
    label: 'Substack',
    value: `${LINKS_ROUTE_PREFIX}/substack`,
    group: 'substack',
    includeDomains: ['substack.com'],
    icon: SubstackIcon,
  },
  {
    label: 'Paragraph',
    value: `${LINKS_ROUTE_PREFIX}/paragraph`,
    group: 'paragraph',
    includeDomains: ['paragraph.xyz'],
    icon: ParagraphIcon,
  },
  {
    label: 'News',
    value: CONTENTS_ROUTE,
    icon: NewsIcon,
  },
  {
    label: 'Mirror',
    value: `${LINKS_ROUTE_PREFIX}/mirror`,
    group: 'mirror',
    includeDomains: ['mirror.xyz'],
    // icon: 'https://mirror.xyz/icon/favicon-32x32.png',
    icon: MirrorIcon,
  },
  {
    label: 'Aburra',
    value: `${LINKS_ROUTE_PREFIX}/aburra`,
    group: 'aburra',
    includeDomains: ['aburra.xyz'],
    // icon: 'https://aburra.xyz/favicon.ico',
    icon: AburraIcon,
  },
  {
    label: 'Launchcaster',
    value: `${LINKS_ROUTE_PREFIX}/launchcaster`,
    group: 'launchcaster',
    includeDomains: ['launchcaster.xyz'],
    // icon: 'https://www.launchcaster.xyz/favicon.ico',
    icon: LaunchcasterIcon,
  },
  {
    label: 'Kiwistand',
    value: `${LINKS_ROUTE_PREFIX}/kiwistand`,
    group: 'kiwistand',
    includeDomains: ['news.kiwistand.com'],
    // icon: 'https://news.kiwistand.com/favicon.ico',
    icon: KiwistandIcon,
  },
  {
    label: 'Weponder',
    value: `${LINKS_ROUTE_PREFIX}/weponder`,
    group: 'weponder',
    includeDomains: ['weponder.io'],
    // icon: 'https://weponder.io/favicon.ico',
    icon: WeponderIcon,
  },
  {
    label: 'Unlonely',
    value: `${LINKS_ROUTE_PREFIX}/unlonely`,
    group: 'unlonely',
    includeDomains: ['unlonely.app'],
    // icon: 'https://unlonely.app/images/favicon-32x32.png',
    icon: UnlonelyIcon,
  },
  {
    label: 'Bountycaster',
    value: `${LINKS_ROUTE_PREFIX}/bountycaster`,
    group: 'bountycaster',
    includeDomains: ['bountycaster.xyz'],
    // icon: 'https://bountycaster.xyz/static/favicons/apple-touch-icon.png',
    icon: BountycasterIcon,
  },
  {
    label: 'Tiles',
    value: `${LINKS_ROUTE_PREFIX}/tiles`,
    group: 'tiles',
    includeDomains: ['tiles.cool'],
    // icon: 'https://www.tiles.cool/favicon.ico',
    icon: TilesIcon,
  },
  {
    label: 'Far.quest',
    value: `${LINKS_ROUTE_PREFIX}/far.quest`,
    group: 'far.quest',
    includeDomains: ['far.quest'],
    // icon: 'https://far.quest/favicon.ico',
    icon: FarQuestIcon,
  },
  {
    label: 'Withfabric',
    value: `${LINKS_ROUTE_PREFIX}/withfabric`,
    group: 'withfabric',
    includeDomains: ['withfabric.xyz'],
    // icon: 'https://withfabric.xyz/favicon.ico',
    icon: WithfabricIcon,
  },
  {
    label: 'Arxiv',
    value: `${LINKS_ROUTE_PREFIX}/arxiv`,
    group: 'arxiv',
    includeDomains: ['arxiv.org'],
    // icon: 'https://arxiv.org/favicon.ico',
    icon: ArxivIcon,
  },
  {
    label: 'Basepaint',
    value: `${LINKS_ROUTE_PREFIX}/basepaint`,
    group: 'basepaint',
    includeDomains: ['basepaint.xyz'],
    // icon: 'https://basepaint.xyz/favicon.ico',
    icon: BasepaintIcon,
  },
  {
    label: 'Warpcast',
    value: `${LINKS_ROUTE_PREFIX}/warpcast`,
    group: 'warpcast',
    includeDomains: ['warpcast.com'],
    // icon: 'https://warpcast.com/favicon.ico',
    icon: WarpcastIcon,
  },
  {
    label: 'Flink',
    value: `${LINKS_ROUTE_PREFIX}/flink`,
    group: 'flink',
    includeDomains: ['flink.fyi'],
    // icon: 'https://flink.fyi/favicon.ico',
    icon: FlinkIcon,
  },
  {
    label: 'Mint.fun',
    value: `${LINKS_ROUTE_PREFIX}/mint.fun`,
    group: 'mint.fun',
    includeDomains: ['mint.fun'],
    // icon: 'https://mint.fun/favicon.ico',
    icon: MintFunIcon,
  },
  {
    label: 'Vercel',
    value: `${LINKS_ROUTE_PREFIX}/vercel`,
    group: 'vercel',
    includeDomains: ['vercel.app'],
    // icon: 'https://vercel.com/favicon.ico',
    icon: VercelIcon,
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
