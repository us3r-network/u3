import { useCallback, useRef, useState } from 'react';
import { useAccessToken as useLensAccessToken } from '@lens-protocol/react-web';
import { useLensCtx } from 'src/contexts/social/AppLensCtx';
import { getLensFollowing } from 'src/services/social/api/lens';

export const getDefaultLensFollowingCachedData = () => {
  return {
    data: [],
    pageInfo: {
      hasNextPage: true,
    },
    endLensCursor: '',
  };
};
type LensFollowingCachedData = ReturnType<
  typeof getDefaultLensFollowingCachedData
>;
type LensFollowingOpts = {
  cachedDataRefValue?: LensFollowingCachedData;
};

export default function useLensFollowing(opts?: LensFollowingOpts) {
  const { cachedDataRefValue } = opts || {};
  const defaultCachedDataRef = useRef({
    ...getDefaultLensFollowingCachedData(),
  });
  const lensFollowingData = cachedDataRefValue || defaultCachedDataRef.current;

  const { sessionProfile: lensSessionProfile } = useLensCtx();
  const { id: lensSessionProfileId } = lensSessionProfile || {};
  // TODO any
  const [lensFollowing, setLensFollowing] = useState<any[]>(
    lensFollowingData.data
  );
  const [loading, setLoading] = useState(false);
  const [pageInfo, setPageInfo] = useState(lensFollowingData.pageInfo);
  const lensAccessToken = useLensAccessToken();
  const loadLensFollowing = useCallback(async () => {
    if (pageInfo.hasNextPage === false) {
      return;
    }
    setLoading(true);
    try {
      const resp = await getLensFollowing({
        lensAccessToken,
        lensProfileId: lensSessionProfileId,
        endLensCursor: lensFollowingData.endLensCursor
          ? lensFollowingData.endLensCursor
          : undefined,
      });
      const { data, pageInfo: respPageInfo } = resp.data.data;

      if (data.length > 0) {
        setLensFollowing((pre) => [...pre, ...data]);
        lensFollowingData.data = lensFollowingData.data.concat(data);
      }
      setPageInfo(respPageInfo);
      lensFollowingData.pageInfo = respPageInfo;
      lensFollowingData.endLensCursor = respPageInfo.endLensCursor;
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [lensSessionProfileId, lensAccessToken, pageInfo]);

  return {
    loadLensFollowing,
    lensFollowing,
    loading,
    pageInfo,
  };
}
