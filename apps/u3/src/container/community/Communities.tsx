import { useEffect, useMemo, useRef } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { getDefaultTrendingCommunitiesCachedData } from '@/hooks/community/useLoadTrendingCommunities';
import { getDefaultNewestCommunitiesCachedData } from '@/hooks/community/useLoadNewestCommunities';
import { cn } from '@/lib/utils';
import useRoute from '@/route/useRoute';
import NavLinkItem from '@/components/layout/NavLinkItem';
import { RouteKey } from '@/route/routes';
import { getDefaultJoinedCommunitiesCachedData } from '@/hooks/community/useLoadJoinedCommunities';
import { CommunityTypesData } from '@/services/community/api/community';
import useLoadCommunityTypes from '@/hooks/community/useLoadCommunityTypes';
import Select2 from '@/components/common/select/Select2';
import CommunitiesGrowing from './CommunitiesGrowing';

export enum FeedsType {
  TRENDING = 'trending',
  JOINED = 'joined',
  NEWEST = 'newest',
}
const defaultCommunitiesCachedData = {
  trending: getDefaultTrendingCommunitiesCachedData(),
  newest: getDefaultNewestCommunitiesCachedData(),
  joined: getDefaultJoinedCommunitiesCachedData(),
};
export default function Communities() {
  const { lastRouteMeta } = useRoute();
  const lastRouteKey = lastRouteMeta.key;
  const { communityTypes, loadCommunityTypes } = useLoadCommunityTypes();
  useEffect(() => {
    loadCommunityTypes();
  }, []);

  const communitiesCachedData = useRef({
    ...defaultCommunitiesCachedData,
  }).current;

  const feedsType = useMemo(() => {
    switch (lastRouteKey) {
      case RouteKey.newestCommunities:
        return FeedsType.NEWEST;
      case RouteKey.joinedCommunities:
        return FeedsType.JOINED;
      default:
        return FeedsType.TRENDING;
    }
  }, [lastRouteKey]);

  const [searchParams, setSearchParams] = useSearchParams();
  const communityTypeFilter = useMemo(
    () => searchParams.get('type'),
    [searchParams]
  );

  useEffect(() => {
    document.getElementById('communities-scroll-wrapper')?.scrollTo(0, 0);
  }, [lastRouteKey]);

  return (
    <div className={cn(`w-full h-full flex bg-[#20262F]`)}>
      <div
        id="communities-scroll-wrapper"
        className="flex-1 h-full overflow-auto"
      >
        <Header
          feedsType={feedsType}
          communityTypes={communityTypes}
          communityTypeFilter={communityTypeFilter}
        />
        <Outlet
          context={{
            feedsType,
            communityTypeFilter,

            communitiesCachedData,
          }}
        />
      </div>
      <div
        className={cn(
          'w-[320px] h-full overflow-auto bg-[#1B1E23]',
          'max-sm:hidden'
        )}
      >
        <CommunitiesGrowing />
      </div>
    </div>
  );
}

function Header({
  feedsType,
  communityTypes,
  communityTypeFilter,
}: {
  feedsType: FeedsType;
  communityTypes: CommunityTypesData;
  communityTypeFilter: string;
}) {
  const navigate = useNavigate();
  const getNavUrl = (type: FeedsType, communityType?: string) => {
    return `/communities/${type}${
      communityType ? `?type=${communityType}` : ''
    }`;
  };
  const validateIsActive = (type: FeedsType) => {
    return type === feedsType;
  };
  const communitTypeOptions = [
    {
      value: null,
      label: 'All Types',
    },
    ...communityTypes.map((item) => ({
      label: item.type,
      value: item.type,
    })),
  ];
  return (
    <div
      className={cn(
        'w-full flex p-[20px] justify-between items-center self-stretch sticky top-0 bg-[#20262F] border-b border-[#39424c] z-10',
        'max-sm:px-[10px] max-sm:py-[14px]'
      )}
    >
      <div
        className={cn(
          'w-full flex items-center gap-[20px]',
          'max-sm:gap-[10px]'
        )}
      >
        <NavLinkItem
          href={getNavUrl(FeedsType.TRENDING)}
          active={validateIsActive(FeedsType.TRENDING)}
          className="w-auto max-sm:p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="max-sm:hidden"
          >
            <path
              d="M14.3945 8.56641C14.207 8.86914 13.9824 9.16602 13.7227 9.45703C13.5966 9.59862 13.4436 9.71369 13.2726 9.79551C13.1015 9.87733 12.9159 9.92427 12.7266 9.93359C12.5371 9.94453 12.3473 9.9177 12.1682 9.85466C11.9892 9.79163 11.8245 9.69364 11.6836 9.56641C11.5211 9.4204 11.3937 9.23945 11.3112 9.03715C11.2287 8.83485 11.193 8.61648 11.207 8.39844C11.2656 7.47266 10.9649 6.38477 10.3125 5.16211C9.98244 4.54883 9.58791 4.02539 9.1172 3.5918C9.06901 3.90167 8.98983 4.20593 8.88087 4.5C8.61349 5.21581 8.22939 5.88238 7.74416 6.47266C7.40726 6.88586 7.02314 7.25819 6.59962 7.58203C5.93556 8.0918 5.38869 8.75391 5.0215 9.49414C4.64579 10.2461 4.45115 11.0754 4.45314 11.916C4.45314 13.3789 5.02931 14.7539 6.07423 15.791C7.12306 16.8301 8.51564 17.4004 10 17.4004C11.4844 17.4004 12.877 16.8301 13.9258 15.791C14.9707 14.7559 15.5469 13.3789 15.5469 11.916C15.5469 11.1504 15.3887 10.4062 15.0781 9.70703C14.8965 9.29688 14.668 8.91602 14.3945 8.56641Z"
              fill={validateIsActive(FeedsType.TRENDING) ? '#FFF' : '#718096'}
            />
            <path
              d="M16.291 9.16404C15.9118 8.31063 15.3606 7.54466 14.6719 6.91404L14.1035 6.39255C14.0842 6.37533 14.061 6.36311 14.0359 6.35697C14.0107 6.35082 13.9845 6.35093 13.9594 6.35729C13.9344 6.36366 13.9112 6.37608 13.8921 6.39346C13.8729 6.41085 13.8584 6.43267 13.8496 6.45701L13.5957 7.18552C13.4375 7.64255 13.1465 8.10935 12.7344 8.56834C12.707 8.59763 12.6758 8.60545 12.6543 8.6074C12.6328 8.60935 12.5996 8.60545 12.5703 8.5781C12.543 8.55466 12.5293 8.51951 12.5312 8.48435C12.6035 7.30857 12.252 5.9824 11.4824 4.53904C10.8457 3.33982 9.96094 2.40427 8.85547 1.75193L8.04883 1.27732C7.94336 1.21482 7.80859 1.29685 7.81445 1.4199L7.85742 2.3574C7.88672 2.99802 7.8125 3.56443 7.63672 4.03513C7.42187 4.6113 7.11328 5.14646 6.71875 5.62693C6.44418 5.96084 6.13299 6.26287 5.79102 6.52732C4.96739 7.16046 4.29768 7.97172 3.83203 8.90037C3.36753 9.83711 3.12557 10.8685 3.125 11.914C3.125 12.8359 3.30664 13.7285 3.66602 14.5703C4.01302 15.3808 4.51379 16.1163 5.14062 16.7363C5.77344 17.3613 6.50781 17.8535 7.32617 18.1953C8.17383 18.5508 9.07227 18.7304 10 18.7304C10.9277 18.7304 11.8262 18.5508 12.6738 18.1972C13.4902 17.8574 14.2325 17.3619 14.8594 16.7383C15.4922 16.1133 15.9883 15.3828 16.334 14.5722C16.6928 13.7327 16.8769 12.829 16.875 11.916C16.875 10.9629 16.6797 10.0371 16.291 9.16404ZM13.9258 15.791C12.877 16.8301 11.4844 17.4004 10 17.4004C8.51562 17.4004 7.12305 16.8301 6.07422 15.791C5.0293 14.7539 4.45312 13.3789 4.45312 11.916C4.45312 11.0664 4.64453 10.2519 5.02148 9.49412C5.38867 8.75388 5.93555 8.09177 6.59961 7.58201C7.02312 7.25817 7.40725 6.88584 7.74414 6.47263C8.23242 5.87693 8.61523 5.21287 8.88086 4.49998C8.98982 4.20591 9.06899 3.90165 9.11719 3.59177C9.58789 4.02537 9.98242 4.5488 10.3125 5.16209C10.9648 6.38474 11.2656 7.47263 11.207 8.39841C11.193 8.61645 11.2286 8.83483 11.3112 9.03713C11.3937 9.23942 11.5211 9.42038 11.6836 9.56638C11.8245 9.69362 11.9892 9.7916 12.1682 9.85464C12.3473 9.91767 12.5371 9.9445 12.7266 9.93357C13.1113 9.91404 13.4648 9.74412 13.7227 9.45701C13.9824 9.16599 14.207 8.86912 14.3945 8.56638C14.668 8.91599 14.8965 9.29685 15.0781 9.70701C15.3887 10.4062 15.5469 11.1504 15.5469 11.916C15.5469 13.3789 14.9707 14.7558 13.9258 15.791Z"
              fill={validateIsActive(FeedsType.TRENDING) ? '#FFF' : '#718096'}
            />
          </svg>
          Trending
        </NavLinkItem>
        <div
          className={cn('w-px h-[16px] bg-[#39424C] hidden', 'max-sm:block')}
        />
        <NavLinkItem
          href={getNavUrl(FeedsType.JOINED)}
          active={validateIsActive(FeedsType.JOINED)}
          className="w-auto max-sm:p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="max-sm:hidden"
          >
            <path
              d="M16.3642 3.63604C15.5302 2.79765 14.5381 2.13298 13.4453 1.68051C12.3526 1.22804 11.181 0.996748 9.99826 1.00003C8.81642 0.997536 7.64581 1.2292 6.55405 1.68165C5.46229 2.1341 4.47103 2.79835 3.63755 3.63604C2.79863 4.4695 2.13352 5.46114 1.68077 6.55349C1.22803 7.64584 0.996642 8.81716 1.00004 9.99957C0.997075 11.1819 1.22866 12.3531 1.68138 13.4454C2.1341 14.5377 2.79898 15.5294 3.63755 16.3631C4.47102 17.2009 5.46225 17.8652 6.554 18.3178C7.64575 18.7704 8.81638 19.0023 9.99826 19C11.181 19.0029 12.3526 18.7713 13.4453 18.3187C14.538 17.8661 15.5301 17.2014 16.3642 16.3631C17.2023 15.5291 17.8667 14.5373 18.3191 13.4451C18.7715 12.3528 19.0029 11.1818 19 9.99957C19.0031 8.81736 18.7717 7.64627 18.3193 6.554C17.8669 5.46173 17.2024 4.46996 16.3642 3.63604ZM6.82052 12.7027C6.97055 12.8993 7.04895 13.1413 7.04277 13.3885C7.03659 13.6358 6.9462 13.8735 6.78654 14.0625C6.738 14.1204 6.6837 14.1732 6.62447 14.2201C6.3969 14.3991 6.10756 14.4805 5.82002 14.4464C5.53247 14.4122 5.27024 14.2654 5.09093 14.0381C4.17352 12.8853 3.67463 11.4553 3.67589 9.98215C3.67582 8.50766 4.17624 7.0768 5.09529 5.9236C5.14204 5.86558 5.19427 5.8122 5.25126 5.76419C5.47354 5.57876 5.76034 5.48911 6.04869 5.51492C6.33703 5.54073 6.60334 5.67988 6.78915 5.90182C6.94809 6.09109 7.03773 6.32888 7.04328 6.57594C7.04882 6.823 6.96994 7.06457 6.81965 7.26077C6.23704 8.04809 5.92267 9.00162 5.92282 9.98098C5.92298 10.9603 6.23766 11.9138 6.82052 12.7009V12.7027ZM11.9422 10.1433C11.9032 10.6037 11.7025 11.0355 11.3755 11.362C11.0486 11.6886 10.6165 11.8889 10.156 11.9274C9.64053 11.969 9.12965 11.8043 8.73569 11.4694C8.34173 11.1345 8.09695 10.6569 8.05519 10.1416C8.04742 10.0372 8.04742 9.93235 8.05519 9.82796C8.09367 9.36765 8.29387 8.93581 8.62033 8.60894C8.94679 8.28208 9.37844 8.0813 9.83881 8.04216C10.3536 7.99949 10.8643 8.16286 11.2587 8.4964C11.6531 8.82994 11.8989 9.30635 11.9422 9.82099C11.9508 9.92825 11.9508 10.036 11.9422 10.1433ZM14.8995 14.0747C14.8536 14.1331 14.8016 14.1866 14.7444 14.2341C14.5218 14.4191 14.2349 14.5083 13.9466 14.4822C13.6583 14.456 13.3922 14.3167 13.2065 14.0947C13.0472 13.9054 12.9574 13.6673 12.952 13.42C12.9466 13.1727 13.0259 12.9309 13.1769 12.7349C13.7594 11.9474 14.0738 10.9938 14.0738 10.0144C14.0738 9.03493 13.7594 8.08134 13.1769 7.29387C13.0267 7.0973 12.9482 6.8554 12.9542 6.60814C12.9602 6.36088 13.0504 6.12308 13.21 5.93405C13.2583 5.87592 13.3126 5.82306 13.372 5.77638C13.5996 5.59701 13.889 5.51534 14.1768 5.54931C14.4645 5.58329 14.727 5.73015 14.9065 5.95757C15.8238 7.11069 16.3224 8.54101 16.3206 10.0144C16.3214 11.4898 15.8202 12.9216 14.8995 14.0747Z"
              fill={validateIsActive(FeedsType.JOINED) ? '#FFF' : '#718096'}
            />
          </svg>
          Joined
        </NavLinkItem>
        <div
          className={cn('w-px h-[16px] bg-[#39424C] hidden', 'max-sm:block')}
        />
        <NavLinkItem
          href={getNavUrl(FeedsType.NEWEST)}
          active={validateIsActive(FeedsType.NEWEST)}
          className="w-auto max-sm:p-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="max-sm:hidden"
          >
            <g clipPath="url(#clip0_3631_4450)">
              <path
                d="M6.58093 9.02782L6.78968 9.80657C6.92031 10.2934 7.06218 10.7459 7.22687 11.1659L7.21249 11.17C6.96281 10.8244 6.65562 10.4369 6.38812 10.1594L5.59749 9.29126L4.55999 9.56938L5.43937 12.8506L6.24249 12.635L6.02624 11.8269C5.89729 11.3377 5.75494 10.8521 5.59937 10.3706L5.61906 10.3653C5.88031 10.7181 6.21343 11.1034 6.48656 11.4009L7.33843 12.3416L8.26343 12.0938L7.38406 8.81251L6.58093 9.02782ZM19.1641 7.54126L16.8459 6.04313L16.7075 3.28688L13.9509 3.14845L12.4528 0.830322L9.99656 2.08876L7.53999 0.830322L6.04187 3.14845L3.28499 3.28688L3.14687 6.04313L0.82843 7.54126L2.08718 9.99751L0.82843 12.4541L3.14687 13.9522L3.28499 16.7084L6.04187 16.8469L7.53999 19.165L9.99624 17.9066L12.4525 19.165L13.9509 16.8469L16.7075 16.7084L16.8459 13.9522L19.1641 12.4541L17.9056 9.99782L19.1641 7.54126ZM17.1291 11.9088L15.3253 13.0744L15.2178 15.2191L13.0731 15.3266L11.9075 17.13L9.99624 16.1509L8.08499 17.13L6.91937 15.3266L4.77499 15.2191L4.66718 13.0744L2.86343 11.9088L3.84249 9.99751L2.86343 8.08657L4.66718 6.92095L4.77499 4.77626L6.91937 4.66876L8.08499 2.86501L9.99624 3.84438L11.9075 2.86501L13.0731 4.66876L15.2175 4.77626L15.3253 6.92095L17.1291 8.08657L16.15 9.99751L17.1291 11.9088ZM9.56031 10.9738L9.39874 10.37L10.5769 10.0544L10.3866 9.34376L9.20843 9.65938L9.06781 9.13376L10.3191 8.79813L10.1256 8.07782L7.99343 8.64907L8.87281 11.9303L11.0728 11.3409L10.88 10.6203L9.56062 10.9738H9.56031ZM13.8556 7.07845L13.9831 8.33314C14.0291 8.73813 14.0737 9.13845 14.1241 9.52157L14.1147 9.52407C13.9753 9.17244 13.8295 8.82342 13.6772 8.4772L13.135 7.27157L12.1956 7.52313L12.3081 8.78157C12.3437 9.20532 12.3809 9.61782 12.4269 10.0025L12.4172 10.005C12.2769 9.67688 12.1025 9.25939 11.9422 8.89563L11.4266 7.72907L10.4819 7.9822L12.1159 11.0613L13.0894 10.8003L12.9931 9.44876C12.9747 9.14595 12.9353 8.82251 12.8853 8.42345L12.8953 8.42095C13.0194 8.74038 13.1528 9.05614 13.2953 9.36782L13.8584 10.5944L14.8175 10.3375L14.7462 6.8397L13.8556 7.07845Z"
                fill={validateIsActive(FeedsType.NEWEST) ? '#FFF' : '#718096'}
              />
            </g>
            <defs>
              <clipPath id="clip0_3631_4450">
                <rect width="20" height="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          Newest
        </NavLinkItem>
      </div>
      <Select2
        options={communitTypeOptions}
        defaultValue={communitTypeOptions[0]?.value}
        value={communityTypeFilter}
        onValueChange={(value) => {
          navigate(getNavUrl(feedsType, value));
        }}
      />
    </div>
  );
}
