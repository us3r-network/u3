import { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'

import {
  useFarcasterGetCastsByFid,
  useFarcasterMakeCast,
  useFarcasterMakeCastWithParentCastId,
  useFarcasterReactionCast,
} from '../hooks/useFarcaster'
import { getFid } from '../utils/farcaster'
import { useEthers } from '../hooks/useEthers'
import { ReactionType } from '@farcaster/hub-web'

export default function Home() {
  const [address, setAddress] = useState<string>()
  const [fid, setFid] = useState<number>()

  const { ethersProvider, connectWallet } = useEthers()
  const { makeCast } = useFarcasterMakeCast({ ethersProvider, fid })
  const { makeCastWithParentCastId } = useFarcasterMakeCastWithParentCastId({
    ethersProvider,
    fid,
  })
  const { reactionCast } = useFarcasterReactionCast({ ethersProvider, fid })
  const { getCastsByFid } = useFarcasterGetCastsByFid()

  const commentCast = useCallback(async () => {
    if (!fid) return
    await makeCastWithParentCastId('this is u3 comment', {
      fid,
      hash: Uint8Array.from([
        234, 106, 89, 24, 111, 173, 70, 78, 247, 39, 117, 34, 139, 53, 72, 2,
        124, 115, 231, 151,
      ]),
    })
  }, [fid, makeCastWithParentCastId])

  const likeCast = useCallback(async () => {
    if (!fid) return
    await reactionCast(
      {
        fid: fid,
        hash: Uint8Array.from([
          234, 106, 89, 24, 111, 173, 70, 78, 247, 39, 117, 34, 139, 53, 72, 2,
          124, 115, 231, 151,
        ]),
      },
      ReactionType.LIKE,
    )
  }, [fid, reactionCast])

  const repostCast = useCallback(async () => {
    if (!fid) return
    await reactionCast(
      {
        fid: fid!,
        hash: Uint8Array.from([
          234, 106, 89, 24, 111, 173, 70, 78, 247, 39, 117, 34, 139, 53, 72, 2,
          124, 115, 231, 151,
        ]),
      },
      ReactionType.RECAST,
    )
  }, [fid, reactionCast])

  useEffect(() => {
    if (!ethersProvider) return
    ethersProvider
      .send('eth_accounts', [])
      .then((accounts) => {
        setAddress(accounts[0])
        return getFid(ethersProvider, accounts[0])
      })
      .then(setFid)
      .catch(console.error)
  }, [ethersProvider])

  return (
    <HomeWrapper>
      <h1>Home</h1>
      {(address && (
        <div>
          <div>{address}</div>

          {(fid && <div>{fid}</div>) || (
            <button
              onClick={async () => {
                const fid = await getFid(ethersProvider!, address)
                setFid(fid)
              }}
            >
              getFid
            </button>
          )}
        </div>
      )) || (
        <div>
          <button
            onClick={async () => {
              const accounts = await connectWallet()
              setAddress(accounts[0])
            }}
          >
            connectWallet
          </button>
        </div>
      )}
      {fid && (
        <div>
          <button onClick={() => makeCast('this is u3 cast')}>makeCast</button>
          <button
            onClick={async () => {
              if (!fid) return
              const data = await getCastsByFid(fid)
              if (!data) return
              data.messages.forEach((cast) => {
                console.log(cast)
              })
            }}
          >
            getCastsByFid
          </button>
          <button onClick={commentCast}>commentCast</button>
          <button onClick={likeCast}>likeCast</button>
          <button onClick={repostCast}>repostCast</button>
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
