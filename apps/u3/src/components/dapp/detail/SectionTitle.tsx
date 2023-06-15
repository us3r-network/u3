/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-02 11:48:16
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 11:51:11
 * @Description: file description
 */
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';

export const SectionTitle = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
  ${isMobile &&
  `
    font-size: 18px;
    line-height: 21px;
  `}
`;
