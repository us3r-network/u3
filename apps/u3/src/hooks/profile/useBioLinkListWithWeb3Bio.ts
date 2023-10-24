import { useEffect, useMemo, useState } from 'react';
import {
  Web3BioProfile,
  Web3BioProfilePlatform,
  getProfilesWithWeb3Bio,
} from '../../api/web3bio';
import { isFarcasterHandle, isLensHandle } from '../../utils/profile/biolink';

export const farcasterHandleToWeb3BioHandle = (handle: string) => {
  return handle.replace(/\.[^.]+$/, `.farcaster`);
};
export const lensHandleToWeb3BioHandle = (handle: string) => {
  return handle.replace(/\.[^.]+$/, `.lens`);
};

export default function useBioLinkListWithWeb3Bio(identity: string) {
  const [bioLinkList, setBioLinkList] = useState<Array<Web3BioProfile>>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchBioLinks = async () => {
      if (!identity) return;
      setLoading(true);
      try {
        let web3BioIdentity = identity;
        if (isFarcasterHandle(identity)) {
          web3BioIdentity = farcasterHandleToWeb3BioHandle(identity);
        } else if (isLensHandle(identity)) {
          web3BioIdentity = lensHandleToWeb3BioHandle(identity);
        }
        const res = await getProfilesWithWeb3Bio(web3BioIdentity);
        const { data } = res || {};
        setBioLinkList(data);
      } catch (error) {
        setBioLinkList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBioLinks();
  }, [identity]);

  const lensBioLinks = useMemo(
    () =>
      bioLinkList?.filter(
        (link) => link.platform === Web3BioProfilePlatform.lens
      ) || [],
    [bioLinkList]
  );
  const fcastBioLinks = useMemo(
    () =>
      bioLinkList?.filter(
        (link) => link.platform === Web3BioProfilePlatform.farcaster
      ) || [],
    [bioLinkList]
  );
  return {
    bioLinkList,
    loading,
    lensBioLinks,
    fcastBioLinks,
  };
}
