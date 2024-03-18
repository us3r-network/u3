import { useProfileState } from '@us3r-network/profile';
import { useEffect, useState } from 'react';
import { isDidPkh } from '@/utils/shared/did';

export default function useHasU3ProfileWithDid(did: string) {
  const { getProfileWithDid } = useProfileState();
  const [u3Profile, setU3Profile] = useState(null);
  const [hasU3ProfileLoading, setHasU3ProfileLoading] = useState(false);
  useEffect(() => {
    (async () => {
      if (isDidPkh(did)) {
        setHasU3ProfileLoading(true);
        const profile = await getProfileWithDid(did);
        if (profile) {
          setU3Profile(profile);
        }
        setHasU3ProfileLoading(false);
      } else {
        setU3Profile(null);
      }
    })();
  }, [did]);
  return {
    u3Profile,
    hasU3ProfileLoading,
  };
}
