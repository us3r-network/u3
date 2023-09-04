import { Asset as AirstackAsset } from '@airstack/airstack-react'
import React from 'react'
import { ComponentProps, useEffect, useRef, useState } from 'react'

function Image(props: ComponentProps<'img'>) {
  const [error, setError] = useState(false)
  const videoEl = useRef<HTMLVideoElement>(null)
  // eslint-disable-next-line react/destructuring-assignment
  const img = props.src || ''

  const attemptPlay = () => {
    if (videoEl && videoEl.current) {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      videoEl.current.play().catch((error) => {
        console.error('Error attempting to play', error)
      })
    }
  }

  useEffect(() => {
    attemptPlay()
  }, [])

  if (img.endsWith('mp4')) {
    return <video src={img} autoPlay muted loop ref={videoEl} />
  }
  if (error || !img) {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} src="images/placeholder.svg" />
  }
  // eslint-disable-next-line jsx-a11y/alt-text
  return <img onError={() => setError(true)} {...props} />
}

type AssetProps = ComponentProps<typeof AirstackAsset> & {
  image?: string
  name: string
}

export function Asset({ image, ...props }: AssetProps) {
  if (image) {
    return <Image src={image} />
  }
  return (
    <AirstackAsset
      preset="medium"
      error={<div>{`${props.name} #${props.tokenId}`}</div>}
      // loading={<img src="images/placeholder.svg" alt="loadig" />}
      {...props}
    />
  )
}
