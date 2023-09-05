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
  PostCardEmbedWrapper,
  PostCardImgWrapper,
  PostCardUserInfo,
  PostCardWrapper,
} from '../common/PostCard'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getFarcasterEmbedMetadata } from '../../api/farcaster'

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

  const embeds: {
    imgs: {
      url: string
    }[]
    webpages: {
      url: string
    }[]
  } = useMemo(() => {
    const imgs = []
    const webpages = []
    for (const embed of cast.embeds) {
      if (!embed?.url) continue
      if (
        embed.url.endsWith('.png') ||
        embed.url.endsWith('.jpg') ||
        embed.url.endsWith('.jpeg') ||
        embed.url.endsWith('.gif')
      ) {
        imgs.push({
          url: embed.url,
        })
      } else {
        webpages.push({
          url: embed.url,
        })
      }
    }
    return { imgs, webpages }
  }, [cast])

  return (
    <PostCardWrapper
      onClick={() => {
        const id = Buffer.from(castId.hash).toString('hex')
        navigate(`/post-detail/fcast/${id}`)
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
      <Embed embedImgs={embeds.imgs} embedWebpages={embeds.webpages} />
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

function Embed({
  embedImgs,
  embedWebpages,
}: {
  embedImgs: { url: string }[]
  embedWebpages: { url: string }[]
}) {
  const viewRef = useRef<HTMLDivElement>(null)
  const [metadata, setMetadata] = useState<
    {
      description: string
      icon: string
      image: string
      title: string
      url: string
    }[]
  >([])

  const getEmbedWebpagesMetadata = async () => {
    const urls = embedWebpages.map((embed) => embed.url)
    if (urls.length === 0) return
    const res = await getFarcasterEmbedMetadata(urls)
    const { metadata } = res.data.data
    const data = metadata.flatMap((m) => (m ? [m] : []))
    setMetadata(data)
  }

  useEffect(() => {
    if (!viewRef.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        getEmbedWebpagesMetadata()
        observer.disconnect()
      }
    })

    observer.observe(viewRef.current)
    return () => {
      observer.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewRef])

  return (
    <div ref={viewRef}>
      {embedImgs && (
        <PostCardImgWrapper>
          {embedImgs.map((img) => (
            // eslint-disable-next-line jsx-a11y/alt-text
            <img src={img.url} />
          ))}
        </PostCardImgWrapper>
      )}
      {metadata.map((item) => {
        return (
          <PostCardEmbedWrapper key={item.url} href={item.url} target="_blank">
            <div>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
            <div
              className="img"
              style={{
                backgroundImage: `url(${item.image})`,
              }}
            />
          </PostCardEmbedWrapper>
        )
      })}
    </div>
  )
}
