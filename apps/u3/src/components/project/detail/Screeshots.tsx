/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 17:51:37
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/screeshots.png';

type Props = StyledComponentPropsWithRef<'div'>;
export default function Screeshots({ ...otherProps }: Props) {
  return (
    <ScreeshotsWrapper {...otherProps}>
      <CardTitle>Screeshots</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </ScreeshotsWrapper>
  );
}

const ScreeshotsWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
