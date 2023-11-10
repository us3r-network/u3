/* eslint-disable no-underscore-dangle */
import { PublicationMetadataMedia } from '@lens-protocol/react-web';

const getAttachmentsData = (attachments?: PublicationMetadataMedia[]): any => {
  if (!attachments) {
    return [];
  }

  return attachments.map((attachment) => {
    switch (attachment.__typename) {
      case 'PublicationMetadataMediaImage':
        return {
          uri: attachment.image.optimized?.uri,
          type: 'Image',
        };
      case 'PublicationMetadataMediaVideo':
        return {
          uri: attachment.video.optimized?.uri,
          coverUri: attachment.cover?.optimized?.uri,
          type: 'Video',
        };
      case 'PublicationMetadataMediaAudio':
        return {
          uri: attachment.audio.optimized?.uri,
          coverUri: attachment.cover?.optimized?.uri,
          artist: attachment.artist,
          type: 'Audio',
        };
      default:
        return [];
    }
  });
};

export default getAttachmentsData;
