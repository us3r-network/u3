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
  PostCardImgWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../common/PostCard'
import { useMemo } from 'react'

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

  const embedsImg: { url: string }[] = useMemo(() => {
    const result = []
    for (const embed of cast.embeds) {
      if (!embed?.url) continue
      if (
        embed.url.endsWith('.png') ||
        embed.url.endsWith('.jpg') ||
        embed.url.endsWith('.jpeg') ||
        embed.url.endsWith('.gif')
      ) {
        result.push({
          url: embed.url,
        })
      }
    }
    return result
  }, [cast])

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
      {embedsImg && (
        <PostCardImgWrapper>
          {embedsImg.map((img) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={img.url} />
          ))}
        </PostCardImgWrapper>
      )}
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
