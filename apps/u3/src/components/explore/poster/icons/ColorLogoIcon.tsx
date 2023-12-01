import { StyledComponentPropsWithRef } from 'styled-components';
import ColorLogoImg from './color-logo.png';

export default function ColorLogoIcon(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <img src={ColorLogoImg} alt="" {...props} />;
}
