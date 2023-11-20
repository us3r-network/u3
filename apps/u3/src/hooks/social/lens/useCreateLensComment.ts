import { useCallback, useEffect, useState } from 'react';
import { Comment, useCreateComment } from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import PubSub from 'pubsub-js';
import {
  PublicationId,
  TextOnlyMetadata,
  textOnly,
} from '@lens-protocol/metadata';
import { lensUploadToArweave } from '../../../utils/social/lens/upload';

export enum LensCommentPubSubTopic {
  SUCCESS = 'lens-comment-success',
  FAILED = 'lens-comment-failed',
}
export function useCreateLensComment(props?: {
  onCommentSuccess?: (args: {
    commentOn: {
      id: PublicationId;
    };
    metadata: TextOnlyMetadata;
  }) => void;
  onCommentFailed?: (error: any) => void;
}) {
  const { execute, error } = useCreateComment();
  const [isPending, setIsPending] = useState(false);

  const createComment = useCallback(
    async (opts: { publicationId: PublicationId; content: string }) => {
      try {
        setIsPending(true);
        const { publicationId, content } = opts;
        const metadata = textOnly({
          content,
        });
        const uri = await lensUploadToArweave(metadata);
        const result = await execute({
          commentOn: publicationId,
          metadata: uri,
        });
        if (result.isFailure()) {
          throw new Error(result.error.message);
        }
        // this might take a while, depends on the type of tx (on-chain or Momoka)
        // and the congestion of the network
        // const completion = await result.value.waitForCompletion();

        // if (completion.isFailure()) {
        //   throw new Error(completion.error.message);
        // }
        PubSub.publish(LensCommentPubSubTopic.SUCCESS, {
          commentOn: {
            id: publicationId,
          },
          metadata: {
            ...(metadata?.lens || {}),
          },
        });
        toast.success('Comment successfully!');
      } catch (err) {
        PubSub.publish(LensCommentPubSubTopic.FAILED, err);
        toast.error('Comment failed!');
      } finally {
        setIsPending(false);
      }
    },
    [execute]
  );

  const { onCommentSuccess, onCommentFailed } = props || {};
  useEffect(() => {
    let successToken: any;
    let failedToken: any;
    if (onCommentSuccess) {
      successToken = PubSub.subscribe(
        LensCommentPubSubTopic.SUCCESS,
        (topic, data) => onCommentSuccess(data)
      );
    }
    if (onCommentFailed) {
      failedToken = PubSub.subscribe(
        LensCommentPubSubTopic.FAILED,
        (topic, data) => onCommentFailed(data)
      );
    }
    return () => {
      if (successToken) {
        PubSub.unsubscribe(successToken);
      }
      if (failedToken) {
        PubSub.unsubscribe(failedToken);
      }
    };
  }, [onCommentSuccess, onCommentFailed]);

  return { createComment, error, isPending };
}
