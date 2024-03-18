import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setBrowsingCommunity,
  clearBrowsingCommunity,
  selectCommunity,
} from '@/features/community/communitySlice';
import { CommunityInfo } from '@/services/community/types/community';

export default function useBrowsingCommunity() {
  const dispatch = useAppDispatch();
  const { browsingCommunity } = useAppSelector(selectCommunity);

  const setBrowsingCommunityAction = useCallback(
    (communityInfo: CommunityInfo) => {
      dispatch(setBrowsingCommunity(communityInfo));
    },
    [dispatch]
  );

  const clearBrowsingCommunityAction = useCallback(() => {
    dispatch(clearBrowsingCommunity());
  }, [dispatch]);

  return {
    browsingCommunity,
    setBrowsingCommunity: setBrowsingCommunityAction,
    clearBrowsingCommunity: clearBrowsingCommunityAction,
  };
}
