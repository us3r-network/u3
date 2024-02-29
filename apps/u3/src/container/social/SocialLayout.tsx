import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { resetFarcasterFollowingData } from 'src/hooks/social/farcaster/useFarcasterFollowing';
import { resetAllFollowingData } from 'src/hooks/social/useAllFollowing';
import { resetLensFollowingData } from 'src/hooks/social/lens/useLensFollowing';

import { FeedsType } from '../../components/social/SocialPageNav';
import { SocialPlatform } from '../../services/social/types';
import { LivepeerProvider } from '../../contexts/social/LivepeerCtx';
import { AllFirst } from './SocialAllFollowing';
import { cn } from '@/lib/utils';
import { ArrowLeft } from '@/components/common/icons/ArrowLeft';
import NavLinkItem from '@/components/layout/NavLinkItem';
import useRoute from '@/route/useRoute';
import { RouteKey } from '@/route/routes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PostsMentionedLinks from './PostsMentionedLinks';

export default function SocialLayoutContainer() {
  return (
    <LivepeerProvider>
      <SocialLayout />
    </LivepeerProvider>
  );
}

const socialPlatformDefault = 'all' as SocialPlatform;
function SocialLayout() {
  const { lastRouteMeta } = useRoute();
  const routeKey = lastRouteMeta.key;
  const [postScroll, setPostScroll] = useState({
    currentParent: '',
    id: '',
    top: 0,
  });

  const [feedsType, setFeedsType] = useState(FeedsType.TRENDING);
  const [socialPlatform, setSocialPlatform] = useState<SocialPlatform>(
    socialPlatformDefault
  );

  useEffect(() => {
    return () => {
      resetFarcasterFollowingData();
      resetAllFollowingData();
      AllFirst.done = false;
      resetLensFollowingData();
    };
  }, []);

  useEffect(() => {
    if (
      [
        RouteKey.socialAllWhatsnew,
        RouteKey.socialFarcasterWhatsnew,
        RouteKey.socialLensWhatsnew,
      ].includes(routeKey)
    ) {
      setFeedsType(FeedsType.WHATSNEW);
      return;
    }
    if (
      [
        RouteKey.socialAllFollowing,
        RouteKey.socialFarcasterFollowing,
        RouteKey.socialLensFollowing,
      ].includes(routeKey)
    ) {
      setFeedsType(FeedsType.FOLLOWING);
      return;
    }
    setFeedsType(FeedsType.TRENDING);
  }, [routeKey]);

  useEffect(() => {
    if (
      [
        RouteKey.socialFarcasterTrending,
        RouteKey.socialFarcasterWhatsnew,
        RouteKey.socialFarcasterFollowing,
      ].includes(routeKey)
    ) {
      setSocialPlatform(SocialPlatform.Farcaster);
      return;
    }
    if (
      [
        RouteKey.socialLensTrending,
        RouteKey.socialLensWhatsnew,
        RouteKey.socialLensFollowing,
      ].includes(routeKey)
    ) {
      setSocialPlatform(SocialPlatform.Lens);
      return;
    }
    setSocialPlatform(socialPlatformDefault);
  }, [routeKey]);

  const isDetail =
    routeKey === RouteKey.socialPostDetailFcast ||
    routeKey === RouteKey.socialPostDetailLens;

  return (
    <div className={cn(`w-full h-full flex bg-[#20262F]`)}>
      <div id="social-scroll-wrapper" className="flex-1 h-full overflow-auto">
        {isDetail ? (
          <PostDetailHeader />
        ) : (
          <PostListHeader
            socialPlatform={socialPlatform}
            feedsSort={feedsType}
          />
        )}
        <Outlet
          context={{
            socialPlatform,
            feedsType,

            postScroll,
            setPostScroll,
          }}
        />
      </div>
      <div className="w-[320px] h-full overflow-auto bg-[#1B1E23] max-sm:hidden">
        <PostsMentionedLinks />
      </div>
    </div>
  );
}

function PostListHeader({
  feedsSort,
  socialPlatform,
}: {
  feedsSort: FeedsType;
  socialPlatform: SocialPlatform;
}) {
  const navigate = useNavigate();
  const getNavUrl = (sort: FeedsType, platform: SocialPlatform) => {
    const sortPath = sort === FeedsType.TRENDING ? '' : sort;
    switch (platform) {
      case SocialPlatform.Farcaster:
        return `/social/farcaster/${sortPath}`;
      case SocialPlatform.Lens:
        return `/social/lens/${sortPath}`;
      default:
        return `/social/all/${sortPath}`;
    }
  };
  const sortIsActive = (sort: FeedsType) => {
    return sort === feedsSort;
  };
  return (
    <div className="w-full flex p-[20px] justify-between items-start self-stretch sticky top-0 bg-[#20262F] border-b border-[#39424c] z-10">
      <div className="w-full flex items-center gap-[20px]">
        <NavLinkItem
          href={getNavUrl(FeedsType.TRENDING, socialPlatform)}
          active={sortIsActive(FeedsType.TRENDING)}
          className="w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M14.3945 8.56641C14.207 8.86914 13.9824 9.16602 13.7227 9.45703C13.5966 9.59862 13.4436 9.71369 13.2726 9.79551C13.1015 9.87733 12.9159 9.92427 12.7266 9.93359C12.5371 9.94453 12.3473 9.9177 12.1682 9.85466C11.9892 9.79163 11.8245 9.69364 11.6836 9.56641C11.5211 9.4204 11.3937 9.23945 11.3112 9.03715C11.2287 8.83485 11.193 8.61648 11.207 8.39844C11.2656 7.47266 10.9649 6.38477 10.3125 5.16211C9.98244 4.54883 9.58791 4.02539 9.1172 3.5918C9.06901 3.90167 8.98983 4.20593 8.88087 4.5C8.61349 5.21581 8.22939 5.88238 7.74416 6.47266C7.40726 6.88586 7.02314 7.25819 6.59962 7.58203C5.93556 8.0918 5.38869 8.75391 5.0215 9.49414C4.64579 10.2461 4.45115 11.0754 4.45314 11.916C4.45314 13.3789 5.02931 14.7539 6.07423 15.791C7.12306 16.8301 8.51564 17.4004 10 17.4004C11.4844 17.4004 12.877 16.8301 13.9258 15.791C14.9707 14.7559 15.5469 13.3789 15.5469 11.916C15.5469 11.1504 15.3887 10.4062 15.0781 9.70703C14.8965 9.29688 14.668 8.91602 14.3945 8.56641Z"
              fill={sortIsActive(FeedsType.TRENDING) ? '#FFF' : '#718096'}
            />
            <path
              d="M16.291 9.16404C15.9118 8.31063 15.3606 7.54466 14.6719 6.91404L14.1035 6.39255C14.0842 6.37533 14.061 6.36311 14.0359 6.35697C14.0107 6.35082 13.9845 6.35093 13.9594 6.35729C13.9344 6.36366 13.9112 6.37608 13.8921 6.39346C13.8729 6.41085 13.8584 6.43267 13.8496 6.45701L13.5957 7.18552C13.4375 7.64255 13.1465 8.10935 12.7344 8.56834C12.707 8.59763 12.6758 8.60545 12.6543 8.6074C12.6328 8.60935 12.5996 8.60545 12.5703 8.5781C12.543 8.55466 12.5293 8.51951 12.5312 8.48435C12.6035 7.30857 12.252 5.9824 11.4824 4.53904C10.8457 3.33982 9.96094 2.40427 8.85547 1.75193L8.04883 1.27732C7.94336 1.21482 7.80859 1.29685 7.81445 1.4199L7.85742 2.3574C7.88672 2.99802 7.8125 3.56443 7.63672 4.03513C7.42187 4.6113 7.11328 5.14646 6.71875 5.62693C6.44418 5.96084 6.13299 6.26287 5.79102 6.52732C4.96739 7.16046 4.29768 7.97172 3.83203 8.90037C3.36753 9.83711 3.12557 10.8685 3.125 11.914C3.125 12.8359 3.30664 13.7285 3.66602 14.5703C4.01302 15.3808 4.51379 16.1163 5.14062 16.7363C5.77344 17.3613 6.50781 17.8535 7.32617 18.1953C8.17383 18.5508 9.07227 18.7304 10 18.7304C10.9277 18.7304 11.8262 18.5508 12.6738 18.1972C13.4902 17.8574 14.2325 17.3619 14.8594 16.7383C15.4922 16.1133 15.9883 15.3828 16.334 14.5722C16.6928 13.7327 16.8769 12.829 16.875 11.916C16.875 10.9629 16.6797 10.0371 16.291 9.16404ZM13.9258 15.791C12.877 16.8301 11.4844 17.4004 10 17.4004C8.51562 17.4004 7.12305 16.8301 6.07422 15.791C5.0293 14.7539 4.45312 13.3789 4.45312 11.916C4.45312 11.0664 4.64453 10.2519 5.02148 9.49412C5.38867 8.75388 5.93555 8.09177 6.59961 7.58201C7.02312 7.25817 7.40725 6.88584 7.74414 6.47263C8.23242 5.87693 8.61523 5.21287 8.88086 4.49998C8.98982 4.20591 9.06899 3.90165 9.11719 3.59177C9.58789 4.02537 9.98242 4.5488 10.3125 5.16209C10.9648 6.38474 11.2656 7.47263 11.207 8.39841C11.193 8.61645 11.2286 8.83483 11.3112 9.03713C11.3937 9.23942 11.5211 9.42038 11.6836 9.56638C11.8245 9.69362 11.9892 9.7916 12.1682 9.85464C12.3473 9.91767 12.5371 9.9445 12.7266 9.93357C13.1113 9.91404 13.4648 9.74412 13.7227 9.45701C13.9824 9.16599 14.207 8.86912 14.3945 8.56638C14.668 8.91599 14.8965 9.29685 15.0781 9.70701C15.3887 10.4062 15.5469 11.1504 15.5469 11.916C15.5469 13.3789 14.9707 14.7558 13.9258 15.791Z"
              fill={sortIsActive(FeedsType.TRENDING) ? '#FFF' : '#718096'}
            />
          </svg>
          Trending
        </NavLinkItem>
        <NavLinkItem
          href={getNavUrl(FeedsType.FOLLOWING, socialPlatform)}
          active={sortIsActive(FeedsType.FOLLOWING)}
          className="w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M11.6667 11.8766V13.6183C10.9125 13.3517 10.1053 13.2699 9.31288 13.3798C8.52048 13.4897 7.76604 13.7882 7.1129 14.2502C6.45976 14.7121 5.92699 15.324 5.55934 16.0345C5.19169 16.745 4.99989 17.5333 5.00004 18.3333L3.33337 18.3325C3.33312 17.3149 3.56581 16.3107 4.01362 15.397C4.46144 14.4832 5.11249 13.6841 5.91689 13.0608C6.72129 12.4376 7.65769 12.0068 8.65434 11.8014C9.65098 11.5959 10.6814 11.6214 11.6667 11.8758V11.8766ZM10 10.8333C7.23754 10.8333 5.00004 8.59581 5.00004 5.83331C5.00004 3.07081 7.23754 0.833313 10 0.833313C12.7625 0.833313 15 3.07081 15 5.83331C15 8.59581 12.7625 10.8333 10 10.8333ZM10 9.16665C11.8417 9.16665 13.3334 7.67498 13.3334 5.83331C13.3334 3.99165 11.8417 2.49998 10 2.49998C8.15837 2.49998 6.66671 3.99165 6.66671 5.83331C6.66671 7.67498 8.15837 9.16665 10 9.16665ZM14.8275 16.595L17.7734 13.6491L18.9525 14.8275L14.8275 18.9525L11.8809 16.0058L13.06 14.8275L14.8267 16.595H14.8275Z"
              fill={sortIsActive(FeedsType.FOLLOWING) ? '#FFF' : '#718096'}
            />
          </svg>
          Following
        </NavLinkItem>
        <NavLinkItem
          href={getNavUrl(FeedsType.WHATSNEW, socialPlatform)}
          active={sortIsActive(FeedsType.WHATSNEW)}
          className="w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <g clipPath="url(#clip0_3631_4450)">
              <path
                d="M6.58093 9.02782L6.78968 9.80657C6.92031 10.2934 7.06218 10.7459 7.22687 11.1659L7.21249 11.17C6.96281 10.8244 6.65562 10.4369 6.38812 10.1594L5.59749 9.29126L4.55999 9.56938L5.43937 12.8506L6.24249 12.635L6.02624 11.8269C5.89729 11.3377 5.75494 10.8521 5.59937 10.3706L5.61906 10.3653C5.88031 10.7181 6.21343 11.1034 6.48656 11.4009L7.33843 12.3416L8.26343 12.0938L7.38406 8.81251L6.58093 9.02782ZM19.1641 7.54126L16.8459 6.04313L16.7075 3.28688L13.9509 3.14845L12.4528 0.830322L9.99656 2.08876L7.53999 0.830322L6.04187 3.14845L3.28499 3.28688L3.14687 6.04313L0.82843 7.54126L2.08718 9.99751L0.82843 12.4541L3.14687 13.9522L3.28499 16.7084L6.04187 16.8469L7.53999 19.165L9.99624 17.9066L12.4525 19.165L13.9509 16.8469L16.7075 16.7084L16.8459 13.9522L19.1641 12.4541L17.9056 9.99782L19.1641 7.54126ZM17.1291 11.9088L15.3253 13.0744L15.2178 15.2191L13.0731 15.3266L11.9075 17.13L9.99624 16.1509L8.08499 17.13L6.91937 15.3266L4.77499 15.2191L4.66718 13.0744L2.86343 11.9088L3.84249 9.99751L2.86343 8.08657L4.66718 6.92095L4.77499 4.77626L6.91937 4.66876L8.08499 2.86501L9.99624 3.84438L11.9075 2.86501L13.0731 4.66876L15.2175 4.77626L15.3253 6.92095L17.1291 8.08657L16.15 9.99751L17.1291 11.9088ZM9.56031 10.9738L9.39874 10.37L10.5769 10.0544L10.3866 9.34376L9.20843 9.65938L9.06781 9.13376L10.3191 8.79813L10.1256 8.07782L7.99343 8.64907L8.87281 11.9303L11.0728 11.3409L10.88 10.6203L9.56062 10.9738H9.56031ZM13.8556 7.07845L13.9831 8.33314C14.0291 8.73813 14.0737 9.13845 14.1241 9.52157L14.1147 9.52407C13.9753 9.17244 13.8295 8.82342 13.6772 8.4772L13.135 7.27157L12.1956 7.52313L12.3081 8.78157C12.3437 9.20532 12.3809 9.61782 12.4269 10.0025L12.4172 10.005C12.2769 9.67688 12.1025 9.25939 11.9422 8.89563L11.4266 7.72907L10.4819 7.9822L12.1159 11.0613L13.0894 10.8003L12.9931 9.44876C12.9747 9.14595 12.9353 8.82251 12.8853 8.42345L12.8953 8.42095C13.0194 8.74038 13.1528 9.05614 13.2953 9.36782L13.8584 10.5944L14.8175 10.3375L14.7462 6.8397L13.8556 7.07845Z"
                fill={sortIsActive(FeedsType.WHATSNEW) ? '#FFF' : '#718096'}
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
      <Select
        onValueChange={(platform) => {
          navigate(getNavUrl(feedsSort, platform as SocialPlatform));
        }}
        defaultValue={socialPlatform}
      >
        <SelectTrigger className="w-[180px] border-none rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium outline-none focus:outline-none focus:border-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5.625 1.875C4.63044 1.875 3.67661 2.27009 2.97335 2.97335C2.27009 3.67661 1.875 4.63044 1.875 5.625C1.875 6.61956 2.27009 7.57339 2.97335 8.27665C3.67661 8.97991 4.63044 9.375 5.625 9.375H8.75C8.91576 9.375 9.07473 9.30915 9.19194 9.19194C9.30915 9.07473 9.375 8.91576 9.375 8.75V5.625C9.375 4.63044 8.97991 3.67661 8.27665 2.97335C7.57339 2.27009 6.61956 1.875 5.625 1.875ZM8.75 10.625H5.625C4.88332 10.625 4.1583 10.8449 3.54161 11.257C2.92493 11.669 2.44428 12.2547 2.16045 12.9399C1.87662 13.6252 1.80236 14.3792 1.94706 15.1066C2.09175 15.834 2.4489 16.5022 2.97335 17.0267C3.4978 17.5511 4.16598 17.9083 4.89341 18.0529C5.62084 18.1976 6.37484 18.1234 7.06006 17.8396C7.74529 17.5557 8.33096 17.0751 8.74301 16.4584C9.15507 15.8417 9.375 15.1167 9.375 14.375V11.25C9.375 11.0842 9.30915 10.9253 9.19194 10.8081C9.07473 10.6908 8.91576 10.625 8.75 10.625ZM14.375 1.875C13.3804 1.875 12.4266 2.27009 11.7234 2.97335C11.0201 3.67661 10.625 4.63044 10.625 5.625V8.75C10.625 8.91576 10.6908 9.07473 10.8081 9.19194C10.9253 9.30915 11.0842 9.375 11.25 9.375H14.375C15.3696 9.375 16.3234 8.97991 17.0267 8.27665C17.7299 7.57339 18.125 6.61956 18.125 5.625C18.125 4.63044 17.7299 3.67661 17.0267 2.97335C16.3234 2.27009 15.3696 1.875 14.375 1.875Z"
              fill="#EEEFF7"
            />
            <path
              opacity="0.3"
              d="M14.3751 10.6249H11.2501C11.0843 10.6249 10.9253 10.6907 10.8081 10.8079C10.6909 10.9251 10.6251 11.0841 10.6251 11.2499V14.3749C10.6251 15.1166 10.845 15.8416 11.2571 16.4583C11.6691 17.075 12.2548 17.5556 12.94 17.8394C13.6252 18.1233 14.3792 18.1975 15.1067 18.0528C15.8341 17.9081 16.5023 17.551 17.0267 17.0265C17.5512 16.5021 17.9083 15.8339 18.053 15.1065C18.1977 14.379 18.1235 13.625 17.8396 12.9398C17.5558 12.2546 17.0751 11.6689 16.4585 11.2569C15.8418 10.8448 15.1168 10.6249 14.3751 10.6249Z"
              fill="#EEEFF7"
            />
          </svg>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-[10px] bg-[#1B1E23] text-[#FFF] text-[14px] font-medium border-none">
          <SelectItem
            value={socialPlatformDefault}
            className="hover:bg-[#20262F]"
          >
            All Platform
          </SelectItem>
          <SelectItem
            value={SocialPlatform.Farcaster}
            className="hover:bg-[#20262F]"
          >
            Farcaster
          </SelectItem>
          <SelectItem
            value={SocialPlatform.Lens}
            className="hover:bg-[#20262F]"
          >
            Lens
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function PostDetailHeader() {
  const navigate = useNavigate();
  return (
    <div className="w-full z-10 flex p-[20px] justify-between items-start self-stretch bg-[#20262F] border-b border-[#39424c]">
      <div>
        <button
          type="button"
          className="rounded-[50%] w-[40px] h-[40px] flex justify-center items-center flex-shrink-0 border-[1px] border-solid border-[#39424c] bg-[var(--neutral-100,_#1a1e23)] cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <ArrowLeft />
        </button>
      </div>
    </div>
  );
}
