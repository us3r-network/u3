import { Post, Comment } from '@lens-protocol/react-web'
import sanitizeDStorageUrl from './sanitizeDStorageUrl'

const getMetadataImg = (publication: Post | Comment): string => {
  const hasImg =
    publication?.metadata?.media[0]?.original?.mimeType?.includes('image')
  let img = hasImg ? publication?.metadata?.media[0]?.original?.url : ''

  return sanitizeDStorageUrl(img)
}

export default getMetadataImg
