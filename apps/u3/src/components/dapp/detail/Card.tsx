/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 16:12:42
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 11:35:40
 * @Description: file description
 */
import styled from 'styled-components';
import CardBase from '../../common/card/CardBase';

const Card = styled(CardBase)`
  border: none;
`;
export default Card;

export const CardTitle = styled.span`
  font-style: italic;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  color: #ffffff;
`;
