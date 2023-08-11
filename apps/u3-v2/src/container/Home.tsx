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

export default function Home() {
  const { connector: activeConnector, isConnected, address } = useAccount()
  const { connect, connectors, error } = useConnect()
  const { farcasterSigner, fid } = useFarcasterCtx()

  const { makeCast } = useFarcasterMakeCast({ signer: farcasterSigner, fid })
  const { makeCastWithParentCastId } = useFarcasterMakeCastWithParentCastId({
    signer: farcasterSigner,
    fid,
  })
  const { reactionCast } = useFarcasterReactionCast({
    signer: farcasterSigner,
    fid,
  })
  const { getCastsByFid } = useFarcasterGetCastsByFid()

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
      <div>
        {isConnected && <div>Connected to {activeConnector?.name}</div>}
        {!isConnected && (
          <div>
            <button
              onClick={() => {
                connect({
                  connector: connectors.find((c) => c.name === 'MetaMask')!,
                })
              }}
            >
              connect
            </button>
          </div>
        )}

        {error && <div>{error.message}</div>}
      </div>
      {address && <div>{address}</div>}
      {(fid && (
        <div>
          <div>{fid}</div>
          <button onClick={() => makeCast('this is u3 cast')}>makeCast</button>
          <button
            onClick={async () => {
              if (!fid) return
              const data = await getCastsByFid(fid)
              if (!data) return
              setCastList(data.messages)
              // data.messages.forEach((cast) => {
              //   console.log(cast)
              // })
            }}
          >
            getCastsByFid
          </button>
        </div>
      )) || <div>register first</div>}

      {castList && (
        <ol>
          {castList.map((cast) => {
            console.log(cast)
            if (!cast.data) return null
            const castId = {
              fid: cast.data.fid,
              hash: cast.hash,
            }
            return (
              <li key={Buffer.from(cast.hash).toString('hex')}>
                {cast.data?.castAddBody?.text}
                <div>
                  <button onClick={() => commentCast(castId)}>
                    commentCast
                  </button>
                  <button onClick={() => likeCast(castId)}>likeCast</button>
                  <button onClick={() => repostCast(castId)}>repostCast</button>
                </div>
              </li>
            )
          })}
        </ol>
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
