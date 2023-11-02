import { useCallback } from 'react';
import { getS3ProfileModel } from '@us3r-network/profile';
import { isEqual } from 'lodash';

const getBioLinksWithDid = async (did: string) => {
  try {
    const s3ProfileModel = getS3ProfileModel();
    const res = await s3ProfileModel.queryBioLinksWithDid(did, {
      first: 1000,
    });
    const data = res.data.node.bioLinkList.edges.map((edge) => edge.node);
    return data;
  } catch (error) {
    return [];
  }
};

export default function useBioLinkActions() {
  const createBioLink = useCallback(
    async ({
      profileID,
      platform,
      network,
      handle,
      data,
    }: {
      profileID: string;
      platform: string;
      network: string;
      handle: string;
      data: string;
    }) => {
      if (!profileID) return;
      try {
        const s3ProfileModel = getS3ProfileModel();
        const res = await s3ProfileModel.createBioLink({
          profileID,
          platform,
          network,
          handle,
          data,
        });
        if (res?.errors?.length > 0) {
          console.error(res.errors);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const updateBioLink = useCallback(
    async ({
      id,
      profileID,
      platform,
      network,
      handle,
      data,
    }: {
      id: string;
      profileID: string;
      platform: string;
      network: string;
      handle: string;
      data: string;
    }) => {
      if (!profileID) return;
      try {
        const s3ProfileModel = getS3ProfileModel();
        const res = await s3ProfileModel.updateBioLink(id, {
          profileID,
          platform,
          network,
          handle,
          data,
        });
        if (res?.errors?.length > 0) {
          console.error(res.errors);
        }
      } catch (error) {
        console.error(error);
      }
    },
    []
  );

  const upsertBioLink = useCallback(
    async ({
      did,
      bioLink,
    }: {
      did: string;
      bioLink: {
        profileID: string;
        platform: string;
        network: string;
        handle: string;
        data: string;
      };
    }) => {
      const bioLinks = await getBioLinksWithDid(did);
      const findBioLink = bioLinks.find((item) => {
        return (
          item.platform === bioLink.platform &&
          item.network === bioLink.network &&
          item.handle === bioLink.handle
        );
      });
      if (findBioLink?.id) {
        const remoteBioLinkData = JSON.parse(findBioLink.data);
        const newBioLinkData = JSON.parse(bioLink.data);
        if (!isEqual(newBioLinkData, remoteBioLinkData))
          updateBioLink({
            id: findBioLink.id,
            ...bioLink,
          });
      } else {
        createBioLink(bioLink);
      }
    },
    [createBioLink, updateBioLink]
  );

  return {
    createBioLink,
    updateBioLink,
    upsertBioLink,
  };
}
