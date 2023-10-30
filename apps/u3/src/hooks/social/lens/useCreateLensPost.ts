import { useCallback } from 'react';
import {
  CollectPolicyType,
  ContentFocus,
  MediaObject,
  ReferencePolicyType,
  useActiveProfile,
  useCreatePost,
} from '@lens-protocol/react-web';
import { lensUploadToArweave } from '../../../utils/social/lens/upload';

export function useCreateLensPost() {
  const { data: publisher } = useActiveProfile();
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({
    publisher,
    upload: lensUploadToArweave,
  });

  const createText = useCallback(
    async (content: string) =>
      create({
        content,
        contentFocus: ContentFocus.TEXT_ONLY,
        locale: 'en',
        collect: {
          type: CollectPolicyType.NO_COLLECT,
        },
        reference: {
          type: ReferencePolicyType.ANYONE,
        },
      }),
    [create]
  );

  const createPost = useCallback(
    async (content: string, media?: MediaObject[]) =>
      create({
        content,
        contentFocus: ContentFocus.ARTICLE,
        locale: 'en',
        media: media || [],
        collect: {
          type: CollectPolicyType.NO_COLLECT,
        },
        reference: {
          type: ReferencePolicyType.ANYONE,
        },
      }),
    [create]
  );

  return { createText, createPost, error, isPending };
}
