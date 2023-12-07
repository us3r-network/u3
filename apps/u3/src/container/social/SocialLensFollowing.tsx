/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:32:04
 * @FilePath: /u3/apps/u3/src/container/social/SocialLensFollowing.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE */

import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from 'src/components/common/loading/Loading';
import useLogin from 'src/hooks/shared/useLogin';
import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import useLensFollowing from 'src/hooks/social/lens/useLensFollowing';
import FollowingDefault from 'src/components/social/FollowingDefault';
import { useLensCtx } from '../../contexts/social/AppLensCtx';
import {
  MainCenter,
  NoLoginStyled,
  LoadingMoreWrapper,
  PostList,
} from './CommonStyles';

export default function SocialLensFollowing() {
  const [parentId] = useState('social-lens-following');
  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);
  const { isLogin } = useLogin();
  const { sessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = sessionProfile || {};

  const { lensFollowing, loadLensFollowing, loading, pageInfo } =
    useLensFollowing();

  useEffect(() => {
    if (!mounted) return;
    if (!isLogin) return;
    if (!lensSessionProfileId) return;
    loadLensFollowing();
  }, [loadLensFollowing, mounted, isLogin, lensSessionProfileId]);

  if (!isLogin) {
    return <NoLoginStyled />;
  }
  if (!lensSessionProfileId) {
    return (
      <MainCenter>
        <FollowingDefault lens />
      </MainCenter>
    );
  }

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={lensFollowing.length}
      next={() => {
        if (loading) return;
        loadLensFollowing();
      }}
      hasMore={pageInfo.hasNextPage || true}
      loader={
        <LoadingMoreWrapper>
          <Loading />
        </LoadingMoreWrapper>
      }
      scrollThreshold={FEEDS_SCROLL_THRESHOLD}
      scrollableTarget="social-scroll-wrapper"
    >
      <PostList>
        {lensFollowing.map(({ platform, data }) => {
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
          return null;
        })}
      </PostList>
    </InfiniteScroll>
  );
}
