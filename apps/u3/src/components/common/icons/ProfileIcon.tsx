import { StyledComponentPropsWithRef } from 'styled-components';
import ProfileImg from '../assets/pngs/profile.png';

export default function ProfileIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={ProfileImg} alt="profile" {...props} />;
}
