import { useCallback, useEffect, useState } from 'react';
import {
  ReactionTypes,
  useActiveProfile,
  useReaction,
  Post,
  Comment,
} from '@lens-protocol/react-web';
import { toast } from 'react-toastify';
import PubSub from 'pubsub-js';

export enum LensReactionUpvotePubSubTopic {
  SUCCESS = 'lens-reaction-upvote-success',
  FAILED = 'lens-reaction-upvote-failed',
}
export function useReactionLensUpvote(props: {
  publication: Post | Comment;
  onReactionSuccess?: (data: {
    originPublication: Post | Comment;
    hasUpvote: boolean;
  }) => void;
  onReactionFailed?: (error: any) => void;
}) {
  const { publication } = props;
  const { data: activeProfile } = useActiveProfile();
  const publisher = activeProfile;

  const { addReaction, removeReaction, isPending } = useReaction({
    profileId: publisher?.id,
  });

  const [hasUpvote, setHasUpvote] = useState(false);
  const { reaction } = publication || {};
  useEffect(() => {
    setHasUpvote(reaction === ReactionTypes.Upvote);
  }, [reaction]);

  const toggleReactionUpvote = useCallback(async () => {
    try {
      if (hasUpvote) {
        await removeReaction({
          reactionType: ReactionTypes.Upvote,
          publication,
        });
        toast.success('Unlike successfully!');
      } else {
        await addReaction({
          reactionType: ReactionTypes.Upvote,
          publication,
        });
        toast.success('Like successfully!');
      }
      setHasUpvote(!hasUpvote);
      PubSub.publish(LensReactionUpvotePubSubTopic.SUCCESS, {
        originPublication: publication,
        hasUpvote: !hasUpvote,
      });
    } catch (error: any) {
      console.error(error?.message);
      PubSub.publish(LensReactionUpvotePubSubTopic.FAILED, error);
      toast.error('Like failed');
    }
  }, [publication, hasUpvote, removeReaction, addReaction]);

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

  return { toggleReactionUpvote, hasUpvote, isPending };
}
