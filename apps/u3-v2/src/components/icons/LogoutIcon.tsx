import { StyledComponentPropsWithRef } from 'styled-components'
import LogoutImg from './pngs/logout.png'

export default function LogoutIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={LogoutImg} alt="logout" {...props} />
}
