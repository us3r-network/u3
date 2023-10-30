/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-06 15:11:44
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-06 15:24:34
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ButtonPrimaryLine } from './ButtonBase';
import RefreshSvg from '../assets/svgs/refresh.svg';

export type ButtonProps = StyledComponentPropsWithRef<'button'>;

export default function ButtonRefresh({
  children,
  ...otherProps
}: ButtonProps) {
  return (
    <ButtonPrimaryLine {...otherProps}>
      {children || <Icon src={RefreshSvg} className="icon" />}
    </ButtonPrimaryLine>
  );
}

const Icon = styled.img`
  width: 24px;
  height: 24px;
`;
