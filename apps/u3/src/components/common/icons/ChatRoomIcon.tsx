import { StyledComponentPropsWithRef } from 'styled-components';
import ChatRoomImg from '../assets/pngs/chat-room.png';

export default function ChatRoomIcon(
  props: StyledComponentPropsWithRef<'img'>
) {
  return <img src={ChatRoomImg} alt="chat room" {...props} />;
}
