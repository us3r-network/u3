import styled from 'styled-components'
import { FarCast } from '../api'
// import { useFarcasterReactionCast } from '../hooks/useFarcaster'
import { useFarcasterCtx } from '../contexts/farcaster'
import {
  CastId,
  ReactionType,
  UserDataType,
  makeReactionAdd,
  makeReactionRemove,
} from '@farcaster/hub-web'
import { useCallback, useMemo, useState } from 'react'
import CommentPostModal from './Modal/CommentPostModal'
import { toast } from 'react-toastify'
import { FARCASTER_CLIENT_NAME } from '../constants/farcaster'
import { FARCASTER_NETWORK, FARCASTER_WEB_CLIENT } from '../constants/farcaster'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCastId from '../hooks/useFarcasterCastId'
import FCastLike from './FCastLike'
import FCastRecast from './FCastRecast'

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  openFarcasterQR: () => void
}) {
  const { isConnected } = useFarcasterCtx()

  const [openComment, setOpenComment] = useState(false)

  const castId: CastId = useFarcasterCastId({ cast })
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData })

  return (
    <CastBox>
      <UserDataBox>
        <div>{userData.pfp && <img src={userData.pfp} alt="" />}</div>
        <div>
          <div>{userData.display} </div>
          <div>{userData.fid} </div>
        </div>
      </UserDataBox>
      <div>{cast.text}</div>
      <small>{cast.created_at}</small>
      <CastTools>
        <FCastLike
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
        <FCastRecast
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
        <button
          onClick={() => {
            if (!isConnected) {
              openFarcasterQR()
              return
            }
            setOpenComment(true)
          }}
        >
          commentCast({cast.comment_count || 0})
        </button>
      </CastTools>
      <CommentPostModal
        castId={castId}
        open={openComment}
        closeModal={() => setOpenComment(false)}
      />
    </CastBox>
  )
}

const CastBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #eee;
  gap: 10px;
`

const UserDataBox = styled.div`
  display: flex;
  gap: 20px;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
`

const CastTools = styled.div`
  display: flex;
  gap: 10px;
`
