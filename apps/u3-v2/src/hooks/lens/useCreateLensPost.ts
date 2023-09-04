import { useCallback } from 'react'
import {
  CollectPolicyType,
  ContentFocus,
  ProfileOwnedByMe,
  ReferencePolicyType,
  useActiveProfile,
  useCreatePost,
} from '@lens-protocol/react-web'
import { lensUploadToArweave } from '../../utils/lens/upload'

export function useCreateLensPost() {
  const { data: publisher } = useActiveProfile()
  const {
    execute: create,
    error,
    isPending,
  } = useCreatePost({
    publisher: publisher as ProfileOwnedByMe,
    upload: lensUploadToArweave,
  })

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
    [create],
  )

  return { createText, error, isPending }
}
