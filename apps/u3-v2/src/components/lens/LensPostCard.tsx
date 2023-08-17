import styled from 'styled-components'
import { LensFeedPost } from '../../api/lens'
import dayjs from 'dayjs'

export default function LensPostCard({ data }: { data: LensFeedPost }) {
  return (
    <CastBox>
      <div key={data.id}>
        <div>
          <p>{data.profile.handle}: </p>
          {data.metadata.content}
        </div>
        <small>{dayjs(data.timestamp).format()}</small>
        <div>
          {/* <button>comment</button> */}
          <button>like</button>
          <button>report</button>
        </div>
      </div>
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
