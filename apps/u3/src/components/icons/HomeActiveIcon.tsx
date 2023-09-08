import { StyledComponentPropsWithRef } from 'styled-components'
import HomeActiveImg from './pngs/home-active.png'

export default function HomeActiveIcon(
  props: StyledComponentPropsWithRef<'img'>,
) {
  return <img src={HomeActiveImg} alt="home active" {...props} />
}
