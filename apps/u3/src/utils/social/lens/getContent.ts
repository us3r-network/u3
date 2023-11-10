/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import { PublicationMetadata } from '@lens-protocol/react-web';

const getContent = (metadata: PublicationMetadata) => {
  switch (metadata.__typename) {
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
