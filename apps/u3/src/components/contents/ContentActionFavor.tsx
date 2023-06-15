/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-13 18:01:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 11:09:24
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import IconLike from '../common/icons/IconLike';

type Props = StyledComponentPropsWithRef<'div'> & {
  number: number;
  isFavored?: boolean;
};
export default function ContentActionFavor({
  number,
  isFavored,
  ...otherProps
}: Props) {
  return (
    <Wrapper {...otherProps}>
      <Icon className="favor-icon" fill={isFavored ? '#718096' : 'none'} />
      <Number className="favor-number">{number}</Number>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;
const Icon = styled(IconLike)`
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
