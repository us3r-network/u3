import { FarCast, SocailPlatform } from '../../api'
import { CastId } from '@farcaster/hub-web'
import useFarcasterUserData from '../../hooks/useFarcasterUserData'
import useFarcasterCastId from '../../hooks/useFarcasterCastId'
import FCastLike from './FCastLike'
import FCastRecast from './FCastRecast'
import { useNavigate } from 'react-router-dom'
import FCastComment from './FCastComment'
import {
  PostCardActionsWrapper,
  PostCardContentWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../common/PostCard'

export default function FCast({
  cast,
  farcasterUserData,
  openFarcasterQR,
}: {
  cast: FarCast
  farcasterUserData: { [key: string]: { type: number; value: string }[] }
  openFarcasterQR: () => void
}) {
  const navigate = useNavigate()

  const castId: CastId = useFarcasterCastId({ cast })
  const userData = useFarcasterUserData({ fid: cast.fid, farcasterUserData })

  return (
    <PostCardWrapper
      onClick={() => {
        const id = Buffer.from(castId.hash).toString('hex')
        navigate(`/post-detail/${id}`)
      }}
    >
      <PostCardUserInfo
        data={{
          platform: SocailPlatform.Farcaster,
          avatar: userData.pfp,
          name: userData.display,
          handle: userData.userName,
          createdAt: cast.created_at,
        }}
      />
      <PostCardContentWrapper>{cast.text}</PostCardContentWrapper>
      <PostCardActionsWrapper
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <FCastLike
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
        <FCastComment
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
        <FCastRecast
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
      </PostCardActionsWrapper>
    </PostCardWrapper>
  )
}
