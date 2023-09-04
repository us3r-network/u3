import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import { useMemo } from 'react'
import { Post, Comment } from '@lens-protocol/react-web'
import getMetadataImg from '../../utils/lens/getMetadataImg'

type Props = {
  publication: Post | Comment
}
export default function LensPostCardContent({ publication }: Props) {
  const img = useMemo(() => getMetadataImg(publication), [publication])
  const markdownContent = useMemo(() => {
    let content = publication?.metadata?.content
    if (!content) return ''
    content = content.replace(
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi,
      '[$1]($1)',
    )
    return content
  }, [publication])
  return (
    <ContentWrapper>
      <ReactMarkdown>{markdownContent}</ReactMarkdown>
      {!!img && <Image src={img} />}
    </ContentWrapper>
  )
}

const ContentWrapper = styled.div`
  width: 100%;
  * {
    color: #fff;
    font-family: Baloo Bhai 2;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 25px; /* 156.25% */
  }
`
const Image = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
`
