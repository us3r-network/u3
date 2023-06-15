/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 14:44:53
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/contributor.png';

type Props = StyledComponentPropsWithRef<'div'>;
export default function Team({ ...otherProps }: Props) {
  return (
    <TeamWrapper {...otherProps}>
      <CardTitle>Team</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </TeamWrapper>
  );
}

const TeamWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
