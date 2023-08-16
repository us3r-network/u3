import { useCallback, useState } from 'react'
import styled from 'styled-components'

import {
  useFarcasterGetCastsByFid,
  useFarcasterMakeCast,
  useFarcasterMakeCastWithParentCastId,
  useFarcasterReactionCast,
} from '../hooks/useFarcaster'
import { CastId, Message, ReactionType } from '@farcaster/hub-web'
import { useAccount, useConnect } from 'wagmi'
import { useFarcasterCtx } from '../context/farcaster'
import useLoadFarcasterFeeds from '../hooks/useLoadFarcasterFeeds'
import FCast from '../components/FCast'

export default function Home() {
  const { connector: activeConnector, isConnected, address } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { farcasterSigner, fid } = useFarcasterCtx()

  const { farcasterFeeds, loadMoreFarcasterFeeds } = useLoadFarcasterFeeds()

  const { makeCastWithParentCastId } = useFarcasterMakeCastWithParentCastId({
    signer: farcasterSigner,
    fid,
  })
  const { reactionCast } = useFarcasterReactionCast({
    signer: farcasterSigner,
    fid,
  })

  const [castList, setCastList] = useState<Message[]>()

  const commentCast = useCallback(
    async (castId: CastId) => {
      if (!fid) return
      await makeCastWithParentCastId('this is u3 comment' + Date.now(), castId)
    },
    [fid, makeCastWithParentCastId],
  )

  const likeCast = useCallback(
    async (castId: CastId) => {
      if (!fid) return
      await reactionCast(castId, ReactionType.LIKE)
    },
    [fid, reactionCast],
  )

  const repostCast = useCallback(
    async (castId: CastId) => {
      if (!fid) return
      await reactionCast(castId, ReactionType.RECAST)
    },
    [fid, reactionCast],
  )

  return (
    <HomeWrapper>
      <div>{address}</div>
      <div>
        <button>+ Post</button>
      </div>
      {farcasterFeeds && (
        <div>
          {farcasterFeeds.map(({ data: cast, platform }) => {
            if (platform === 'farcaster') {
              return (
                <FCast
                  key={Buffer.from(cast.hash.data).toString('hex')}
                  cast={cast}
                />
              )
            }
            return null
          })}
          <button onClick={loadMoreFarcasterFeeds}>loadMore</button>
        </div>
      )}
    </HomeWrapper>
  )
}

const HomeWrapper = styled.div`
  width: 100%;
  height: 100vh;
  padding: 24px;
  box-sizing: border-box;
`
