import styled from 'styled-components';
import { ButtonPrimary } from '../../common/button/ButtonBase';

export const SocialButtonPrimary = styled(ButtonPrimary)`
  height: 40px;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  border-radius: 10px;
  background: linear-gradient(87deg, #cd62ff 0%, #62aaff 100%);

  color: #000;
  font-family: Rubik;
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;

export const SocialButtonPrimaryLine = styled(SocialButtonPrimary)`
  border: 1px solid #cd62ff;

  font-family: Baloo Bhai 2;
  font-size: 12px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  background: linear-gradient(83deg, #cd62ff 0%, #62aaff 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
