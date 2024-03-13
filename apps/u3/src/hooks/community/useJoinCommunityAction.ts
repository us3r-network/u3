import { useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  fetchJoiningCommunity,
  fetchUnjoiningCommunity,
} from '@/services/community/api/community';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import useLogin from '../shared/useLogin';
import {
  addOneToJoinActionPendingIds,
  addOneToJoinedCommunities,
  removeOneFromJoinActionPendingIds,
  removeOneFromJoinedCommunities,
  selectJoinCommunity,
} from '@/features/community/joinCommunitySlice';
import { ApiRespCode } from '@/services/shared/types';
import { CommunityInfo } from '@/services/community/types/community';

export default function useJoinCommunityAction(communityInfo: CommunityInfo) {
  const communityId = communityInfo?.id;
  const dispatch = useAppDispatch();
  const { isLogin, login } = useLogin();
  const { joinActionPendingIds, joinedCommunities, joinedCommunitiesPending } =
    useAppSelector(selectJoinCommunity);

  const joined = useMemo(
    () => joinedCommunities.some((item) => item.id === communityId),
    [joinedCommunities, communityId]
  );
  const isPending = useMemo(
    () => joinActionPendingIds.includes(communityId),
    [joinActionPendingIds, communityId]
  );
  const isDisabled = useMemo(
    () => !communityId || isPending || joinedCommunitiesPending,
    [communityId, isPending, joinedCommunitiesPending]
  );

  const joiningAction = useCallback(async () => {
    if (!isLogin) {
      login();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(communityId));
      const response = await fetchJoiningCommunity(communityId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(addOneToJoinedCommunities(communityInfo));
        toast.success('Join success');
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Join failed: ${error.message}`);
    } finally {
      dispatch(removeOneFromJoinActionPendingIds(communityId));
    }
  }, [dispatch, communityId, communityInfo, isPending, isLogin]);

  const unjoiningAction = useCallback(async () => {
    if (!isLogin) {
      login();
      return;
    }
    if (isPending) return;
    try {
      dispatch(addOneToJoinActionPendingIds(communityId));
      const response = await fetchUnjoiningCommunity(communityId);
      const { code, msg } = response.data;
      if (code === ApiRespCode.SUCCESS) {
        dispatch(removeOneFromJoinedCommunities(communityId));
        toast.success('Unjoin success');
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Unjoin failed: ${error.message}`);
    } finally {
      dispatch(removeOneFromJoinActionPendingIds(communityId));
    }
  }, [dispatch, isPending, communityId, isLogin]);

  const joinChangeAction = () => {
    if (joined) {
      unjoiningAction();
    } else {
      joiningAction();
    }
  };

  return {
    joined,
    isPending,
    isDisabled,
    joiningAction,
    unjoiningAction,
    joinChangeAction,
  };
}
