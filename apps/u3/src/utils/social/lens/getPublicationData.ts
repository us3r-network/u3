/* eslint-disable no-case-declarations */
/* eslint-disable no-underscore-dangle */
import { PublicationMetadata } from '@lens-protocol/react-web';
import getAttachmentsData from './getAttachmentsData';
import { PLACEHOLDER_IMAGE } from './constants';

export type MetadataAsset = {
  uri: string;
  cover?: string;
  artist?: string;
  title?: string;
  type: 'Image' | 'Video' | 'Audio';
};

const getPublicationData = (
  metadata: PublicationMetadata
): {
  content?: string;
  asset?: MetadataAsset;
  attachments?: {
    uri: string;
    type: 'Image' | 'Video' | 'Audio';
  }[];
} | null => {
  switch (metadata.__typename) {
    case 'ArticleMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments),
      };
    case 'TextOnlyMetadataV3':
    case 'LinkMetadataV3':
      return {
        content: metadata.content,
      };
    case 'ImageMetadataV3':
      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.image.optimized?.uri,
          type: 'Image',
        },
        attachments: getAttachmentsData(metadata.attachments),
      };
    case 'AudioMetadataV3':
      const audioAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.audio.optimized?.uri || audioAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            audioAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          artist: metadata.asset.artist || audioAttachments?.artist,
          title: metadata.title,
          type: 'Audio',
        },
      };
    case 'VideoMetadataV3':
      const videoAttachments = getAttachmentsData(metadata.attachments)[0];

      return {
        content: metadata.content,
        asset: {
          uri: metadata.asset.video.optimized?.uri || videoAttachments?.uri,
          cover:
            metadata.asset.cover?.optimized?.uri ||
            videoAttachments?.coverUri ||
            PLACEHOLDER_IMAGE,
          type: 'Video',
        },
      };
    case 'LiveStreamMetadataV3':
      return {
        content: metadata.content,
        attachments: getAttachmentsData(metadata.attachments),
      };
    default:
      return null;
  }
};

export default getPublicationData;
