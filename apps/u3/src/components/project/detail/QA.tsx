/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:57:43
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 17:52:22
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import Card, { CardTitle } from './Card';
import ComingSoonImgUrl from './imgs/q_a.png';

type Props = StyledComponentPropsWithRef<'div'>;
export default function QA({ ...otherProps }: Props) {
  return (
    <QAWrapper {...otherProps}>
      <CardTitle>Q&A</CardTitle>
      <ComingSoonImg src={ComingSoonImgUrl} />
    </QAWrapper>
  );
}

const QAWrapper = styled(Card)`
  width: 100%;
`;
const ComingSoonImg = styled.img`
  width: 100%;
  margin-top: 20px;
`;
