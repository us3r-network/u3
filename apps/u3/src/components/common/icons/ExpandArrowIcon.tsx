import { StyledComponentPropsWithRef } from 'styled-components';
import ExpandArrowImg from '../assets/pngs/expand-arrow.png';

export default function ExpandArrowIcon(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <img src={ExpandArrowImg} alt="expand arrow" {...props} />;
}
