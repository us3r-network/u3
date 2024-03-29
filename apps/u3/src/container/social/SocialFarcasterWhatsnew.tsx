/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:31:54
 * @FilePath: /u3/apps/u3/src/container/social/SocialFarcasterWhatsnew.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Loading from 'src/components/common/loading/Loading';
import FCast from 'src/components/social/farcaster/FCast';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useFarcasterWhatsnew from 'src/hooks/social/farcaster/useFarcasterWhatsnew';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
  PostList,
} from '@/components/social/CommonStyles';
import { getSocialDetailShareUrlWithFarcaster } from '@/utils/shared/share';
import { getExploreFcPostDetailPath } from '@/route/path';

export default function SocialFarcasterWhatsnew() {
  const [parentId] = useState('social-farcaster-whatsnew');
  const { openFarcasterQR } = useFarcasterCtx();
  const { whatsnewCachedData, setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);
  const navigate = useNavigate();

  const {
    loading,
    pageInfo,
    loadFarcasterWhatsnew,
    farcasterWhatsnew,
    farcasterWhatsnewUserDataObj,
  } = useFarcasterWhatsnew({
    cachedDataRefValue: whatsnewCachedData,
  });

  useEffect(() => {
    if (mounted && !whatsnewCachedData?.data?.length) {
      loadFarcasterWhatsnew();
    }
  }, [mounted]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={farcasterWhatsnew.length}
      next={() => {
        if (loading) return;
        loadFarcasterWhatsnew();
      }}
      hasMore={pageInfo.hasNextPage}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      endMessage={<EndMsgContainer>No more data</EndMsgContainer>}
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {farcasterWhatsnew.map(({ platform, data }) => {
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                isV2Layout
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={farcasterWhatsnewUserDataObj}
                shareLink={getSocialDetailShareUrlWithFarcaster(key)}
                castClickAction={(e, castHex) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: key,
                    top: (e.target as HTMLDivElement).offsetTop,
                  });
                  navigate(getExploreFcPostDetailPath(castHex));
                }}
              />
            );
          }
          return null;
        })}
      </PostList>
    </InfiniteScroll>
  );
}
