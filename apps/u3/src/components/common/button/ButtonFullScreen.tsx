/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 14:47:25
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 14:58:08
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { ButtonPrimaryLine } from './ButtonBase';
import ExpandSvg from '../assets/svgs/expand.svg';
import ShrinkSvg from '../assets/svgs/shrink.svg';

export type ButtonProps = StyledComponentPropsWithRef<'button'> & {
  isFullscreen?: boolean;
};

export default function ButtonFullScreen({
  isFullscreen,
  ...otherProps
}: ButtonProps) {
  return (
    <FullScreenButtonWrapper {...otherProps}>
      <ButtonIcon
        src={isFullscreen ? ShrinkSvg : ExpandSvg}
        className="btn-icon"
      />
      <ButtonText className="btn-text">
        {isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
      </ButtonText>
    </FullScreenButtonWrapper>
  );
}

const FullScreenButtonWrapper = styled(ButtonPrimaryLine)`
  height: 32px;
  padding: 6px 8px;
`;
const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
`;
const ButtonText = styled.span`
  font-weight: 400;
  font-size: 12px;
  line-height: 14px;
  white-space: nowrap;
`;
