import { StyledComponentPropsWithRef } from 'styled-components';
import HeyImg from '../assets/platform/pngs/hey.png';

export default function HeyIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={HeyImg} alt="hey" width="12px" height="12px" {...props} />;
}
