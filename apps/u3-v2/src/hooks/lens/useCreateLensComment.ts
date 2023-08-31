import { useCallback, useEffect } from 'react'
import {
  CollectPolicyType,
  ContentFocus,
  CreateCommentArgs,
  ProfileOwnedByMe,
  ReferencePolicyType,
  publicationId,
  useActiveProfile,
  useCreateComment,
} from '@lens-protocol/react-web'
import { toast } from 'react-toastify'
import PubSub from 'pubsub-js'
import { lensUploadToArweave } from '../../utils/lens'

export enum LensCommentPubSubTopic {
  SUCCESS = 'lens-comment-success',
  FAILED = 'lens-comment-failed',
}
export function useCreateLensComment(props?: {
  onCommentSuccess?: (args: CreateCommentArgs) => void
  onCommentFailed?: (error: any) => void
}) {
  const { data: activeProfile } = useActiveProfile()
  const publisher = activeProfile as ProfileOwnedByMe

  const {
    execute: executeComment,
    isPending,
    error,
  } = useCreateComment({
    publisher,
    upload: lensUploadToArweave,
  })

  const createComment = useCallback(
    async (opts: { publicationId: string; content: string }) => {
      const { publicationId: pid, content } = opts
      try {
        const createCommentArgs: CreateCommentArgs = {
          publicationId: publicationId(pid),
          content,
          contentFocus: ContentFocus.TEXT_ONLY,
          locale: 'en',
          collect: {
            type: CollectPolicyType.NO_COLLECT,
          },
          reference: {
            type: ReferencePolicyType.ANYONE,
          },
        }
        await executeComment(createCommentArgs)
        PubSub.publish(LensCommentPubSubTopic.SUCCESS, createCommentArgs)
        toast.success('Comment successfully!')
      } catch (error) {
        PubSub.publish(LensCommentPubSubTopic.FAILED, error)
        toast.error('Comment failed!')
      }
    },
    [executeComment],
  )

  const { onCommentSuccess, onCommentFailed } = props || {}
  useEffect(() => {
    let successToken: any, failedToken: any
    if (onCommentSuccess) {
      successToken = PubSub.subscribe(
        LensCommentPubSubTopic.SUCCESS,
        (topic, data) => onCommentSuccess(data),
      )
    }
    if (onCommentFailed) {
      failedToken = PubSub.subscribe(
        LensCommentPubSubTopic.FAILED,
        (topic, data) => onCommentFailed(data),
      )
    }
    return () => {
      if (successToken) {
        PubSub.unsubscribe(successToken)
      }
      if (failedToken) {
        PubSub.unsubscribe(failedToken)
      }
    }
  }, [onCommentSuccess, onCommentFailed])

  return { createComment, error, isPending }
}
