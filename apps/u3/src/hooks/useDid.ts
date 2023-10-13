import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { getS3ProfileModel, useProfileState } from '@us3r-network/profile';
import { getDidPkhWithAddress } from '../utils/did';
import {
  BIOLINK_FARCASTER_NETWORK,
  BIOLINK_LENS_NETWORK,
  BIOLINK_PLATFORMS,
  isFarcasterHandle,
  isLensHandle,
} from '../utils/profile/biolink';

// 0x...
const isWalletAddress = (str: string) => {
  return /^0x[a-fA-F0-9]{40}$/.test(str);
};
// xxx.eth
const isEnsAddress = (str: string) => {
  return /^[a-zA-Z0-9-]+\.eth$/.test(str);
};

export type BioLinksEqualToFilters = {
  platform?: string;
  network?: string;
  handle?: string;
};
const s3ProfileModel = getS3ProfileModel();

const getEqualToFilters = (filters: BioLinksEqualToFilters) => {
  const inputAnd = [];
  for (const key in filters) {
    if (key in filters) {
      inputAnd.push({
        where: {
          [key]: {
            equalTo: filters[key as keyof BioLinksEqualToFilters],
          },
        },
      });
    }
  }
  return { and: inputAnd };
};

const queryBioLinkWithFilters = async ({
  handle,
  platform,
  network,
}: {
  handle: string;
  platform: string;
  network: string;
}) => {
  const filters = getEqualToFilters({
    platform,
    network,
    handle,
  });
  try {
    const res = await s3ProfileModel.queryBioLinksWithFilters({
      filters,
    });
    const biolink = res?.data?.bioLinkIndex?.edges[0]?.node;
    return biolink || null;
  } catch (error) {
    return null;
  }
};

export default function useDid(user: string) {
  const [did, setDid] = useState('');
  const [loading, setLoading] = useState(false);
  const publicClient = usePublicClient({
    chainId: 1,
  });
  const { s3ProfileModalInitialed } = useProfileState();

  useEffect(() => {
    (async () => {
      if (!user) return;

      if (isWalletAddress(user)) {
        setDid(getDidPkhWithAddress(user));
        return;
      }

      if (isEnsAddress(user)) {
        setLoading(true);
        try {
          const res = await publicClient.getEnsAddress({
            name: user,
          });
          setDid(getDidPkhWithAddress(res));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (isLensHandle(user)) {
        if (!s3ProfileModalInitialed || !s3ProfileModel) return;
        setLoading(true);
        try {
          const biolink = await queryBioLinkWithFilters({
            platform: BIOLINK_PLATFORMS.lens,
            network: BIOLINK_LENS_NETWORK,
            handle: user,
          });
          if (biolink) {
            setDid(biolink.creator.id);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
        return;
      }

      if (isFarcasterHandle(user)) {
        if (!s3ProfileModalInitialed || !s3ProfileModel) return;
        setLoading(true);
        try {
          const biolink = await queryBioLinkWithFilters({
            platform: BIOLINK_PLATFORMS.farcaster,
            network: String(BIOLINK_FARCASTER_NETWORK),
            handle: user,
          });
          if (biolink) {
            setDid(biolink.creator.id);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [user, publicClient, s3ProfileModalInitialed]);

  return {
    did,
    loading,
  };
}
