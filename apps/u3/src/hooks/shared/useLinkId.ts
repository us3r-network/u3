/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from 'react';
import { Link } from '@us3r-network/data-model';
import { getS3LinkModel, useLinkState } from '@us3r-network/link';

export const useLinkId = (link: Link | undefined) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();
  const [linkId, setLinkId] = useState<string>('');

  const getLinkId = async (link: Link) => {
    if (!s3LinkModel || !s3LinkModalInitialed) return '';
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
      return links[0].node.id;
    }
    return '';
  };

  useEffect(() => {
    if (link && link.url && link.type) {
      getLinkId(link).then((id) => {
        if (id) setLinkId(id);
        else setLinkId('');
      });
    }
  }, [link?.url]);

  return { getLinkId, setLinkId, linkId };
};
