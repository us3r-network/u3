import { useCallback, useEffect, useMemo, useState } from 'react';
import { getS3ProfileModel } from '@us3r-network/profile';
import { Profile as LensProfile } from '@lens-protocol/react-web';
import { BIOLINK_PLATFORMS } from '../../utils/profile/biolink';

export default function useBioLinkListWithDid(did: string) {
  const [bioLinkList, setBioLinkList] = useState<
    Array<{
      id: string;
      profileID: string;
      platform?: string;
      network?: string;
      handle?: string;
      data?: string;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const fetchBioLinks = useCallback(async () => {
    if (!did) {
      setBioLinkList([]);
      return;
    }
    setLoading(true);
    try {
      const s3ProfileModel = getS3ProfileModel();
      const res = await s3ProfileModel.queryBioLinksWithDid(did, {
        first: 1000,
      });
      const data = res?.data?.node?.bioLinkList?.edges
        ?.filter((edge) => !!edge.node)
        .map((edge) => edge.node);
      setBioLinkList(data);
    } catch (error) {
      setBioLinkList([]);
    } finally {
      setLoading(false);
    }
  }, [did]);
  useEffect(() => {
    fetchBioLinks();
  }, [fetchBioLinks]);

  const lensBioLinks = useMemo(
    () =>
      bioLinkList?.filter((link) => link.platform === BIOLINK_PLATFORMS.lens) ||
      [],
    [bioLinkList]
  );
  const fcastBioLinks = useMemo(
    () =>
      bioLinkList?.filter(
        (link) => link.platform === BIOLINK_PLATFORMS.farcaster
      ) || [],
    [bioLinkList]
  );
  const lensBioLinkProfiles = useMemo(
    () =>
      lensBioLinks
        .map((item) => {
          try {
            return JSON.parse(item.data) as LensProfile;
          } catch (error) {
            return null;
          }
        })
        .filter((item) => !!item),
    [lensBioLinks]
  );
  const fcastBioLinkProfiles = useMemo(
    () =>
      fcastBioLinks
        .map((item) => {
          try {
            return JSON.parse(item.data) as {
              fid: string;
              type: number;
              value: string;
            };
          } catch (error) {
            return null;
          }
        })
        .filter((item) => !!item),
    [fcastBioLinks]
  );
  return {
    bioLinkList,
    loading,
    lensBioLinks,
    fcastBioLinks,
    lensBioLinkProfiles,
    fcastBioLinkProfiles,
    refetchBioLinks: fetchBioLinks,
  };
}
