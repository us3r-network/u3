/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-18 09:54:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-18 09:58:15
 * @Description: 文本超出显示省略号
 */
import styled from 'styled-components';

const EllipsisText = styled.span<{ row?: number }>`
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: ${({ row }) => row ?? 1};
`;
export default EllipsisText;
