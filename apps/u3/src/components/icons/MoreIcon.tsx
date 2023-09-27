import { StyledComponentPropsWithRef } from 'styled-components';
import Img from './pngs/more.png';

export default function MoreIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={Img} alt="more" {...props} />;
}
