/* eslint-disable @typescript-eslint/no-shadow */
import { useState } from 'react';
import { Link } from '@us3r-network/data-model';
import { getS3LinkModel, useLinkState } from '@us3r-network/link';

export const useFetchLinkIdWithLink = () => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();
  const [linkId, setLinkId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const fetchLinkIdWithLink = async (link: Link) => {
    if (!s3LinkModel || !s3LinkModalInitialed) return '';
    try {
      setLoading(true);
      const filters = {
        where: {
          url: {
            equalTo: link.url,
          },
          type: {
            equalTo: link.type,
          },
        },
      };
      const resp = await s3LinkModel?.queryLinks({
        filters,
      });
      const links = resp?.data?.linkIndex?.edges;
      if (links && links.length > 0) {
        const { id } = links[0].node;
        setLinkId(id);
        return id;
      }
      throw new Error('No link found');
    } catch (error) {
      setLinkId('');
      return '';
    } finally {
      setLoading(false);
    }
  };

  return { fetchLinkIdWithLink, loading, linkId };
};
