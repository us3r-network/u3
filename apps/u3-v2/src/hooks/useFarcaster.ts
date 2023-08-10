import { ethers } from 'ethers'
import * as ed from '@noble/ed25519'
import {
  EthersEip712Signer,
  FidRequest,
  HubResult,
  NobleEd25519Signer,
  makeCastAdd,
  makeSignerAdd,
  makeReactionAdd,
  ReactionType,
  CastId,
} from '@farcaster/hub-web'
import {
  FARCASTER_NETWORK,
  FARCASTER_WEB_CLIENT,
} from '../constants/farcaster-contract'
import React, { useCallback } from 'react'

export function useFarcasterMakeCast({
  fid,
  ethersProvider,
}: {
  ethersProvider?: ethers.BrowserProvider
  fid?: number
}) {
  const makeCast = useCallback(
    async (castText: string) => {
      if (!ethersProvider) return
      if (!fid) return

      const dataOptions = {
        fid: fid,
        network: FARCASTER_NETWORK,
      }

      const { eip712Signer, ed25519Signer, signerPublicKeyResult } =
        await getEip712Signer(ethersProvider)

      if (signerPublicKeyResult.isErr()) {
        console.log(signerPublicKeyResult.error)
        return
      }

      const signerAddResult = await makeSignerAdd(
        { signer: signerPublicKeyResult._unsafeUnwrap() },
        dataOptions,
        eip712Signer,
      )
      const signerAdd = signerAddResult._unsafeUnwrap()
      const result = await FARCASTER_WEB_CLIENT.submitMessage(signerAdd)

      if (result.isErr()) {
        console.log(result.error)
        return
      }

      const cast = await makeCastAdd(
        {
          text: castText,
          embeds: [],
          embedsDeprecated: [],
          mentions: [],
          mentionsPositions: [],
        },
        dataOptions,
        ed25519Signer,
      )
      if (cast.isErr()) {
        console.log(cast.error)
        return
      }
      cast.map((castAdd) => FARCASTER_WEB_CLIENT.submitMessage(castAdd))
    },
    [ethersProvider, fid],
  )

  return { makeCast }
}

export function useFarcasterMakeCastWithParentCastId({
  fid,
  ethersProvider,
}: {
  ethersProvider?: ethers.BrowserProvider
  fid?: number
}) {
  const makeCastWithParentCastId = useCallback(
    async (castText: string, parentCastId: CastId) => {
      if (!ethersProvider) return
      if (!fid) return

      const dataOptions = {
        fid,
        network: FARCASTER_NETWORK,
      }

      const { eip712Signer, ed25519Signer, signerPublicKeyResult } =
        await getEip712Signer(ethersProvider)

      if (signerPublicKeyResult.isErr()) {
        console.log(signerPublicKeyResult.error)
        return
      }

      const signerAddResult = await makeSignerAdd(
        { signer: signerPublicKeyResult._unsafeUnwrap() },
        dataOptions,
        eip712Signer,
      )
      const signerAdd = signerAddResult._unsafeUnwrap()
      const result = await FARCASTER_WEB_CLIENT.submitMessage(signerAdd)

      if (result.isErr()) {
        console.log(result.error)
        return
      }

      const cast = await makeCastAdd(
        {
          text: castText,
          embeds: [],
          embedsDeprecated: [],
          mentions: [],
          mentionsPositions: [],
          parentCastId,
        },
        dataOptions,
        ed25519Signer,
      )
      if (cast.isErr()) {
        console.log(cast.error)
        return
      }
      cast.map((castAdd) => FARCASTER_WEB_CLIENT.submitMessage(castAdd))
    },
    [ethersProvider, fid],
  )

  return { makeCastWithParentCastId }
}

export function useFarcasterReactionCast({
  fid,
  ethersProvider,
}: {
  ethersProvider?: ethers.BrowserProvider
  fid?: number
}) {
  const reactionCast = useCallback(
    async (
      targetCastId: CastId,
      actionType: ReactionType.LIKE | ReactionType.RECAST,
    ) => {
      if (!ethersProvider) return
      if (!fid) return

      const dataOptions = {
        fid: fid,
        network: FARCASTER_NETWORK,
      }

      const { eip712Signer, ed25519Signer, signerPublicKeyResult } =
        await getEip712Signer(ethersProvider)

      if (signerPublicKeyResult.isErr()) {
        console.log(signerPublicKeyResult.error)
        return
      }

      const signerAddResult = await makeSignerAdd(
        { signer: signerPublicKeyResult._unsafeUnwrap() },
        dataOptions,
        eip712Signer,
      )
      const signerAdd = signerAddResult._unsafeUnwrap()
      const result = await FARCASTER_WEB_CLIENT.submitMessage(signerAdd)

      if (result.isErr()) {
        console.log(result.error)
        return
      }

      const cast = await makeReactionAdd(
        {
          type: actionType,
          targetCastId: targetCastId,
        },
        dataOptions,
        ed25519Signer,
      )
      if (cast.isErr()) {
        console.log(cast.error)
        return
      }
      cast.map((castAdd) => FARCASTER_WEB_CLIENT.submitMessage(castAdd))
    },
    [ethersProvider, fid],
  )

  return { reactionCast }
}

export function useFarcasterGetCastsByFid() {
  const getCastsByFid = useCallback(async (fid: number) => {
    const queryConditions: FidRequest = {
      fid,
      pageSize: 10,
      reverse: true,
    }

    const casts = await FARCASTER_WEB_CLIENT.getCastsByFid(queryConditions)
    if (casts.isErr()) {
      console.log(casts.error)
      return undefined
    }
    const value = casts.value
    return value
  }, [])

  return { getCastsByFid }
}

async function getEip712Signer(
  ethersProvider: ethers.BrowserProvider,
): Promise<{
  eip712Signer: EthersEip712Signer
  signerPublicKeyResult: HubResult<Uint8Array>
  ed25519Signer: NobleEd25519Signer
}> {
  const provider = ethersProvider
  const signer = await provider.getSigner()
  const eip712Signer = new EthersEip712Signer(signer)

  const signerPrivateKey = ed.utils.randomPrivateKey()
  const ed25519Signer = new NobleEd25519Signer(signerPrivateKey)
  const signerPublicKeyResult = await ed25519Signer.getSignerKey()
  return { eip712Signer, signerPublicKeyResult, ed25519Signer }
}
