import { useCallback } from "react";
import { fetchJoinedCommunities } from "~/services/community/api/community";
import { useAppDispatch, useAppSelector } from "~/store/hooks";
import {
  selectJoinCommunity,
  setJoinedCommunities,
  setJoinedCommunitiesPending,
} from "~/features/community/joinCommunitySlice";

export default function useAllJoinedCommunities() {
  const dispatch = useAppDispatch();
  const { joinedCommunities, joinedCommunitiesPending } =
    useAppSelector(selectJoinCommunity);

  const loadAllJoinedCommunities = useCallback(async () => {
    try {
      dispatch(setJoinedCommunitiesPending(true));
      const res = await fetchJoinedCommunities({
        pageSize: 1000, // TODO 用的分页列表接口，默认取1000个作为所有列表
        pageNumber: 1,
      });
      const { code, msg, data } = res.data;
      if (code === 0) {
        dispatch(setJoinedCommunities(data));
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(setJoinedCommunitiesPending(false));
    }
  }, [dispatch]);

  const clearJoinedCommunities = useCallback(() => {
    dispatch(setJoinedCommunities([]));
  }, [dispatch]);

  return {
    joinedCommunities,
    joinedCommunitiesPending,
    loadAllJoinedCommunities,
    clearJoinedCommunities,
  };
}
