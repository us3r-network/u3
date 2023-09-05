import styled, { StyledComponentPropsWithRef } from 'styled-components'
import ForwardIcon from '../icons/ForwardIcon'

interface PostReportProps {
  totalReposts: number
  reposted?: boolean
  reposting?: boolean
  repostAction?: () => void
}
export default function PostReport ({
  totalReposts,
  reposted,
  reposting,
  repostAction,
  ...wrapperProps
}: StyledComponentPropsWithRef<'div'> & PostReportProps) {
  return (
    <PostReportWrapper
      onClick={e => {
        if (repostAction) e.stopPropagation()
        if (!reposting && repostAction) repostAction()
      }}
      {...wrapperProps}
    >
      <ForwardIcon stroke={reposted ? '#9C9C9C' : 'white'} />
      {totalReposts} {reposting ? 'Reposting' : 'Reposts'}
    </PostReportWrapper>
  )
}

const PostReportWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;

  color: #9c9c9c;
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 30px; /* 250% */
`
