import styled from 'styled-components'
import { FarCast } from '../api'
import { useFarcasterCtx } from '../contexts/FarcasterCtx'
import { CastId } from '@farcaster/hub-web'
import { useMemo, useState } from 'react'
import CommentPostModal from './Modal/CommentPostModal'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCastId from '../hooks/useFarcasterCastId'
import FCastLike from './FCastLike'
import FCastRecast from './FCastRecast'
import { getCurrFid } from '../utils/farsign-utils'

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

  const newestComment = useMemo(() => {
    if (cast.comments.length === 0) {
      return null
    }
    return cast.comments[cast.comments.length - 1]
  }, [cast])

  const newestCommentUserData = useFarcasterUserData({
    fid: newestComment?.fid + '',
    farcasterUserData,
  })

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
          commentCast({cast.comment_count})
        </button>
      </CastTools>
      {newestComment && (
        <NewestComment>
          <UserDataBox>
            <div>
              {newestCommentUserData.pfp && (
                <img src={newestCommentUserData.pfp} alt="" />
              )}
            </div>
            <div>
              <div>{newestCommentUserData.display} </div>
              <div>{newestCommentUserData.fid} </div>
            </div>
          </UserDataBox>
          <div>{newestComment.text}</div>
          <small>{newestComment.created_at}</small>
        </NewestComment>
      )}
      <CommentPostModal
        cast={cast}
        farcasterUserData={farcasterUserData}
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
  gap: 10px;
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

const NewestComment = styled.div`
  border-left: 1px solid gray;
  margin-left: 10px;
  padding-left: 10px;
`
