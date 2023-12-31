import { StyledComponentPropsWithRef } from 'styled-components';
import Img from '../assets/pngs/add-user.png';

export default function AddUserIcon(props: StyledComponentPropsWithRef<'img'>) {
  return <img src={Img} alt="add user" {...props} />;
}
