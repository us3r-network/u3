import { useCallback } from 'react';
import { toast } from 'react-toastify';
import {
  JoinedCommunitiesData,
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

export default function useJoinCommunityAction() {
  const dispatch = useAppDispatch();
  const { isLogin } = useLogin();
  const { joinActionPendingIds, joinedCommunities, joinedCommunitiesPending } =
    useAppSelector(selectJoinCommunity);

  const validateJoinActionIsPending = useCallback(
    (id: string | number) => {
      return joinActionPendingIds.includes(id);
    },
    [joinActionPendingIds]
  );

  const joiningAction = useCallback(
    async (id: string | number, communityInfo: JoinedCommunitiesData[0]) => {
      if (!isLogin) return;
      if (validateJoinActionIsPending(id)) return;
      try {
        dispatch(addOneToJoinActionPendingIds(id));
        const response = await fetchJoiningCommunity(id);
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
        dispatch(removeOneFromJoinActionPendingIds(id));
      }
    },
    [dispatch, validateJoinActionIsPending, isLogin]
  );

  const unjoiningAction = useCallback(
    async (id: string | number) => {
      if (!isLogin) return;
      if (validateJoinActionIsPending(id)) return;
      try {
        dispatch(addOneToJoinActionPendingIds(id));
        const response = await fetchUnjoiningCommunity(id);
        const { code, msg } = response.data;
        if (code === ApiRespCode.SUCCESS) {
          dispatch(removeOneFromJoinedCommunities(id));
          toast.success('Unjoin success');
        } else {
          throw new Error(msg);
        }
      } catch (error) {
        console.error(error);
        toast.error(`Unjoin failed: ${error.message}`);
      } finally {
        dispatch(removeOneFromJoinActionPendingIds(id));
      }
    },
    [dispatch, validateJoinActionIsPending]
  );

  const validateJoined = useCallback(
    (id: string | number) => {
      return joinedCommunities.some((item) => item.id === id);
    },
    [joinedCommunities]
  );

  const validateJoinActionIsDisabled = useCallback(
    (id: string | number) => {
      return validateJoinActionIsPending(id) || joinedCommunitiesPending;
    },
    [validateJoinActionIsPending, joinedCommunitiesPending]
  );

  return {
    joiningAction,
    unjoiningAction,
    validateJoined,
    validateJoinActionIsPending,
    validateJoinActionIsDisabled,
  };
}
