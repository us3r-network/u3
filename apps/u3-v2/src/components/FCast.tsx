import styled from 'styled-components'
import { FarCast } from '../api'
import { useFarcasterMakeCast } from '../hooks/useFarcaster'
import { useFarcasterCtx } from '../context/farcaster'

export default function FCast({ cast }: { cast: FarCast }) {
  const { farcasterSigner, fid } = useFarcasterCtx()
  const { makeCast } = useFarcasterMakeCast({ signer: farcasterSigner, fid })
  return (
    <CastBox>
      <div>
        <span>{cast.fid}: </span>
        {cast.text}
      </div>
      <div>
        <button onClick={() => makeCast('other addr')}>makeCast</button>
      </div>
    </CastBox>
  )
}

const CastBox = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #eee;
`
