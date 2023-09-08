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
