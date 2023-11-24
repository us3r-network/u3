import { useCallback, useEffect, useState } from 'react';
import { PrimaryPublication, useCreateMirror } from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import PubSub from 'pubsub-js';

export enum LensMirrorPubSubTopic {
  SUCCESS = 'lens-mirror-success',
  FAILED = 'lens-mirror-failed',
}
export function useCreateLensMirror({
  publication,
  onMirrorSuccess,
  onMirrorFailed,
}: {
  publication: PrimaryPublication;
  onMirrorSuccess?: (originPublication: PrimaryPublication) => void;
  onMirrorFailed?: (error: any) => void;
}) {
  const { execute, error } = useCreateMirror();
  const [isPending, setIsPending] = useState(false);

  const createMirror = useCallback(async () => {
    try {
      setIsPending(true);
      const result = await execute({
        mirrorOn: publication.id, // the publication ID to mirror
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
      PubSub.publish(LensMirrorPubSubTopic.SUCCESS, publication);
      toast.success('Mirror successfully');
    } catch (err: any) {
      console.error(err?.message);
      PubSub.publish(LensMirrorPubSubTopic.FAILED, err);
      toast.error('Mirror failed');
    } finally {
      setIsPending(false);
    }
  }, [execute, publication]);

  useEffect(() => {
    let successToken: any;
    let failedToken: any;
    if (onMirrorSuccess) {
      successToken = PubSub.subscribe(
        LensMirrorPubSubTopic.SUCCESS,
        (topic, data) => onMirrorSuccess(data)
      );
    }
    if (onMirrorFailed) {
      failedToken = PubSub.subscribe(
        LensMirrorPubSubTopic.FAILED,
        (topic, err) => onMirrorFailed(err)
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
  }, [onMirrorSuccess, onMirrorFailed]);

  return { createMirror, error, isPending };
}
