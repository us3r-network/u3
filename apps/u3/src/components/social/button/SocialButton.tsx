import styled from 'styled-components';
import ColorButton from '@/components/common/button/ColorButton';
import { ButtonPrimaryLine } from '@/components/common/button/ButtonBase';

export const SocialButtonPrimary = styled(ColorButton)`
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 10px;

  color: #fff;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SocialButtonPrimaryLine = styled(ButtonPrimaryLine)`
  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
