/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import { PublicationMetadata } from '@lens-protocol/react-web';

const getContent = (metadata: PublicationMetadata) => {
  const typename = metadata?.__typename;
  switch (typename) {
    case 'ArticleMetadataV3':
    case 'TextOnlyMetadataV3':
    case 'LinkMetadataV3':
    case 'ImageMetadataV3':
    case 'AudioMetadataV3':
    case 'VideoMetadataV3':
    case 'LiveStreamMetadataV3':
      return metadata.content;
    default:
      return '';
  }
};

export default getContent;
