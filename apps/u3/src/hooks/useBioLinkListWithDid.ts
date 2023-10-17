import { useEffect, useState } from 'react';
import { getS3ProfileModel } from '@us3r-network/profile';

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
  useEffect(() => {
    const fetchBioLinks = async () => {
      if (!did) return;
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
    };
    fetchBioLinks();
  }, [did]);
  return {
    bioLinkList,
    loading,
  };
}
