import { useCallback, useEffect } from 'react';
import {
  ProfileOwnedByMe,
  useActiveProfile,
  useCreateMirror,
  Post,
  Comment,
} from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import PubSub from 'pubsub-js';

export enum LensMirrorPubSubTopic {
  SUCCESS = 'lens-mirror-success',
  FAILED = 'lens-mirror-failed',
}
export function useCreateLensMirror(props: {
  publication: Post | Comment;
  onMirrorSuccess?: (originPublication: Post | Comment) => void;
  onMirrorFailed?: (error: any) => void;
}) {
  const { publication } = props;
  const { data: activeProfile } = useActiveProfile();
  const publisher = activeProfile;

  const {
    execute: executeMirror,
    error,
    isPending,
  } = useCreateMirror({ publisher });

  const createMirror = useCallback(async () => {
    try {
      await executeMirror({
        publication,
      });
      PubSub.publish(LensMirrorPubSubTopic.SUCCESS, publication);
      toast.success('Mirror successfully');
    } catch (err: any) {
      console.error(err?.message);
      PubSub.publish(LensMirrorPubSubTopic.FAILED, err);
      toast.error('Mirror failed');
    }
  }, [executeMirror, publication]);

  const { onMirrorSuccess, onMirrorFailed } = props || {};
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
