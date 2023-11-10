/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useState } from 'react';
import {
  PrimaryPublication,
  PublicationReactionType,
  useReactionToggle,
} from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import PubSub from 'pubsub-js';

export enum LensReactionUpvotePubSubTopic {
  SUCCESS = 'lens-reaction-upvote-success',
  FAILED = 'lens-reaction-upvote-failed',
}
export function useReactionLensUpvote(props: {
  publication: PrimaryPublication;
  onReactionSuccess?: (data: {
    originPublication: PrimaryPublication;
    hasUpvoted: boolean;
  }) => void;
  onReactionFailed?: (error: any) => void;
}) {
  const { publication } = props;

  const { execute: toggle, loading: isPending, error } = useReactionToggle();

  const [hasUpvoted, setHasUpvoted] = useState(false);
  const { hasUpvoted: hasUpvotedDefault } = publication?.operations || {};
  useEffect(() => {
    setHasUpvoted(hasUpvoted);
  }, [hasUpvotedDefault]);

  const toggleReactionUpvote = useCallback(async () => {
    try {
      await toggle({
        reaction: PublicationReactionType.Upvote,
        publication,
      });
      if (hasUpvoted) {
        toast.success('Unlike successfully!');
      } else {
        toast.success('Like successfully!');
      }
      setHasUpvoted(!hasUpvoted);
      PubSub.publish(LensReactionUpvotePubSubTopic.SUCCESS, {
        originPublication: publication,
        hasUpvoted: !hasUpvoted,
      });
      // eslint-disable-next-line @typescript-eslint/no-shadow
    } catch (error) {
      console.error(error?.message);
      PubSub.publish(LensReactionUpvotePubSubTopic.FAILED, error);
      toast.error('Like failed');
    }
  }, [publication, hasUpvoted, toggle]);

  const { onReactionSuccess, onReactionFailed } = props;
  useEffect(() => {
    let successToken: any;
    let failedToken: any;
    if (onReactionSuccess) {
      successToken = PubSub.subscribe(
        LensReactionUpvotePubSubTopic.SUCCESS,
        (topic, data) => onReactionSuccess(data)
      );
    }
    if (onReactionFailed) {
      failedToken = PubSub.subscribe(
        LensReactionUpvotePubSubTopic.FAILED,
        (topic, error) => onReactionFailed(error)
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
  }, [onReactionSuccess, onReactionFailed]);

  return { toggleReactionUpvote, hasUpvoted, isPending, error };
}
