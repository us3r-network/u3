import styled from 'styled-components'
import { FarCast } from '../api'
import { CastId } from '@farcaster/hub-web'
import useFarcasterUserData from '../hooks/useFarcasterUserData'
import useFarcasterCastId from '../hooks/useFarcasterCastId'
import FCastLike from './FCastLike'
import FCastRecast from './FCastRecast'
import { useNavigate } from 'react-router-dom'
import FCastComment from './FCastComment'

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
    <CastBox
      onClick={() => {
        const id = Buffer.from(castId.hash).toString('hex')
        navigate(`/post-detail/${id}`)
      }}
    >
      <UserDataBox>
        <div>{userData.pfp && <img src={userData.pfp} alt="" />}</div>
        <div>
          <div>{userData.display} </div>
          <div>@{userData.userName} </div>
        </div>
      </UserDataBox>
      <div>{cast.text}</div>
      <small>{cast.created_at}</small>
      <CastTools
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
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
        <FCastComment
          openFarcasterQR={openFarcasterQR}
          cast={cast}
          farcasterUserData={farcasterUserData}
        />
      </CastTools>
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
