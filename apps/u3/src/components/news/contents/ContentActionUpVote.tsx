/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-13 18:01:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 14:42:20
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import UpvoteIconUrl from '../../common/assets/imgs/upvote.png';

type Props = StyledComponentPropsWithRef<'div'> & {
  number: number;
};
export default function ContentActionUpVote({ number, ...otherProps }: Props) {
  return (
    <Wrapper {...otherProps}>
      <Icon className="upvote-icon" src={UpvoteIconUrl} />
      <Number className="upvote-number">{number}</Number>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const Icon = styled.img`
  width: 14px;
  height: 14px;
`;
const Number = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: #ffffff;
`;
