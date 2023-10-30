import { StyledComponentPropsWithRef } from 'styled-components';
import BackImg from '../assets/pngs/back.png';

export default function BackIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={BackImg} alt="back" {...props} />;
}
