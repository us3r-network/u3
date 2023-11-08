import { useCallback } from 'react';
import { useCreatePost } from '@lens-protocol/react-web';
import { article, textOnly, MediaImage } from '@lens-protocol/metadata';
import { lensUploadToArweave } from '../../../utils/social/lens/upload';

export function useCreateLensPost() {
  const { execute, error, loading } = useCreatePost();

  const createText = useCallback(
    async (content: string) => {
      const metadata = textOnly({
        content,
      });
      const uri = await lensUploadToArweave(metadata);
      const result = await execute({
        metadata: uri,
      });
      if (result.isFailure()) {
        throw new Error(result.error.message);
      }
      // this might take a while, depends on the type of tx (on-chain or Momoka)
      // and the congestion of the network
      const completion = await result.value.waitForCompletion();

      if (completion.isFailure()) {
        throw new Error(completion.error.message);
      }
    },
    [execute]
  );

  const createPost = useCallback(
    async (content: string, attachments?: MediaImage[]) => {
      const metadata = article({
        content,
        attachments,
      });
      const uri = await lensUploadToArweave(metadata);
      const result = await execute({
        metadata: uri,
      });
      if (result.isFailure()) {
        throw new Error(result.error.message);
      }
      // this might take a while, depends on the type of tx (on-chain or Momoka)
      // and the congestion of the network
      const completion = await result.value.waitForCompletion();

      if (completion.isFailure()) {
        throw new Error(completion.error.message);
      }
    },
    [execute]
  );

  return { createText, createPost, error, isPending: loading };
}
