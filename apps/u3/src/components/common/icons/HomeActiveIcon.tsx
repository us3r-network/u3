import { StyledComponentPropsWithRef } from 'styled-components';
import HomeActiveImg from '../assets/pngs/home-active.png';

export default function HomeActiveIcon(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <img src={HomeActiveImg} alt="home active" {...props} />;
}
