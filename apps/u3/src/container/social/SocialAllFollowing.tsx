/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-01 11:09:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-06 11:30:33
 * @FilePath: /u3/apps/u3/src/container/social/SocialAllFollowing.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import InfiniteScroll from 'react-infinite-scroll-component';
import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { useFarcasterCtx } from 'src/contexts/social/FarcasterCtx';
import FCast from 'src/components/social/farcaster/FCast';
import Loading from 'src/components/common/loading/Loading';

import useListScroll from 'src/hooks/social/useListScroll';
import { FEEDS_SCROLL_THRESHOLD } from 'src/services/social/api/feeds';
import useAllFollowing from 'src/hooks/social/useAllFollowing';
import LensPostCard from 'src/components/social/lens/LensPostCard';
import { useLensCtx } from 'src/contexts/social/AppLensCtx';

import {
  EndMsgContainer,
  LoadingMoreWrapper,
  MainCenter,
  NoLoginStyled,
  PostList,
} from './CommonStyles';
import useLogin from '../../hooks/shared/useLogin';
import FollowingDefault from '../../components/social/FollowingDefault';

export const AllFirst = {
  done: false,
};

export default function SocialAllFollowing() {
  const [parentId] = useState('social-all-following');
  const { isLogin } = useLogin();
  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  const { currFid } = useFarcasterCtx();
  const { openFarcasterQR } = useFarcasterCtx();
  const { setPostScroll } = useOutletContext<any>(); // TODO: any
  const { mounted } = useListScroll(parentId);

  const { allFollowing, loadAllFollowing, loading, pageInfo, allUserDataObj } =
    useAllFollowing();

  useEffect(() => {
    if (AllFirst.done) return;
    if (!mounted) return;
    if (!isLogin) return;
    if (!currFid && !lensSessionProfileId) return;

    loadAllFollowing().finally(() => {
      AllFirst.done = true;
    });
  }, [mounted, isLogin, currFid, lensSessionProfileId]);

  if (!isLogin) {
    return <NoLoginStyled />;
  }
  if (!currFid && !lensSessionProfileId) {
    return (
      <MainCenter>
        <FollowingDefault farcaster lens />
      </MainCenter>
    );
  }

  return (
    <InfiniteScroll
      style={{ overflow: 'hidden' }}
      dataLength={allFollowing.length}
      next={() => {
        if (loading) return;
        loadAllFollowing(true);
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
        {allFollowing.map(({ platform, data }) => {
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
                key={key}
                cast={data}
                openFarcasterQR={openFarcasterQR}
                farcasterUserData={{}}
                farcasterUserDataObj={allUserDataObj}
                showMenuBtn
                cardClickAction={(e) => {
                  setPostScroll({
                    currentParent: parentId,
                    id: key,
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
