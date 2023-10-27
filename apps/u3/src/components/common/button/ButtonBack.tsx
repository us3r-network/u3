/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-06 15:11:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 15:24:34
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ButtonPrimaryLine } from './ButtonBase';
import ArrowNarrowLeftSvg from '../assets/svgs/arrow-narrow-left.svg';

export type ButtonProps = StyledComponentPropsWithRef<'button'>;

export default function ButtonBack({ children, ...otherProps }: ButtonProps) {
  return (
    <Wrapper {...otherProps}>
      {children || (
        <>
          <Icon src={ArrowNarrowLeftSvg} className="icon" />
          <Text>Back</Text>
        </>
      )}
    </Wrapper>
  );
}
const Wrapper = styled(ButtonPrimaryLine)`
  display: flex;
  align-items: center;
  padding: 10px;
  gap: 8px;
  width: 81px;
  height: 40px;
  border-radius: 100px;
`;
const Icon = styled.img`
  width: 20px;
  height: 20px;
`;
const Text = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;
`;
