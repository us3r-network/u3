/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:31:44
 * @FilePath: /u3/apps/u3/src/container/social/SocialAllWhatsnew.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useNavigate, useOutletContext } from 'react-router-dom';
import Loading from 'src/components/common/loading/Loading';
import FCast from 'src/components/social/farcaster/FCast';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import useAllWhatsnew from 'src/hooks/social/useAllWhatsnew';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import {
  EndMsgContainer,
  LoadingMoreWrapper,
  PostList,
} from '@/components/social/CommonStyles';
import { getSocialDetailShareUrlWithFarcaster } from '@/utils/shared/share';
import { getExploreFcPostDetailPath } from '@/route/path';

export default function SocialAllWhatsnew() {
  const [parentId] = useState('social-all-whatsnew');
  const { openFarcasterQR } = useFarcasterCtx();
  const { whatsnewCachedData, setPostScroll } = useOutletContext<any>();
  const navigate = useNavigate();

  const { mounted } = useListScroll(parentId);
  const { loading, loadAllWhatsnew, allWhatsnew, allUserDataObj, pageInfo } =
    useAllWhatsnew({
      cachedDataRefValue: whatsnewCachedData,
    });

  useEffect(() => {
    if (mounted && !whatsnewCachedData?.data?.length) {
      loadAllWhatsnew();
    }
  }, [mounted]);

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={allWhatsnew.length}
      next={() => {
        if (loading) return;
        loadAllWhatsnew();
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
        {(allWhatsnew || []).map(({ platform, data }) => {
          if (platform === 'lens') {
            return (
              <LensPostCard
                key={data.id}
                data={data}
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: data.id,
                    top: (e.target as HTMLDivElement).offsetTop,
                  });
                }}
              />
            );
          }
          if (platform === 'farcaster') {
            const key = Buffer.from(data.hash.data).toString('hex');
            return (
              <FCast
                isV2Layout
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={allUserDataObj}
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
