import { StyledComponentPropsWithRef } from 'styled-components';
import HomeImg from '../assets/pngs/home.png';

export default function HomeIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={HomeImg} alt="home" {...props} />;
}
