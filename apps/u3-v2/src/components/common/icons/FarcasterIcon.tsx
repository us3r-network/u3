import { StyledComponentPropsWithRef } from 'styled-components'
import FarcasterImg from './pngs/farcaster.png'

export default function FarcasterIcon(
  props: StyledComponentPropsWithRef<'img'>,
) {
  return (
    <img
      src={FarcasterImg}
      alt="farcaster"
      width="12px"
      height="12px"
      {...props}
    />
  )
}
