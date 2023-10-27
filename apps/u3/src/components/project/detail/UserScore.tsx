/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 17:55:50
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from '../../common/assets/imgs/user_score.png';

type Props = StyledComponentPropsWithRef<'div'>;
export default function UserScore({ ...otherProps }: Props) {
  return (
    <UserScoreWrapper {...otherProps}>
      <CardTitle>User Score</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </UserScoreWrapper>
  );
}

const UserScoreWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
