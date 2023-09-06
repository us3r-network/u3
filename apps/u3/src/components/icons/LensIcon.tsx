import { StyledComponentPropsWithRef } from 'styled-components';
import LensImg from './pngs/lens.png';

export default function LensIcon(props: StyledComponentPropsWithRef<'img'>) {
  return (
    <img src={LensImg} alt="farcaster" width="12px" height="12px" {...props} />
  );
}
