/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-01 14:54:29
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-01 14:59:48
 * @Description: file description
 */
import styled from 'styled-components';
import { ReactComponent as IconArrowCircleRight } from '../common/assets/svgs/arrow-circle-right.svg';

export default function TitleMobile({
  text,
  viewAllAction,
}: {
  text: string;
  viewAllAction?: () => void;
}) {
  return (
    <Box>
      <span>{text}</span>
      {viewAllAction && <IconArrowCircleRight onClick={viewAllAction} />}
    </Box>
  );
}

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  > span {
    font-style: italic;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;

    color: #ffffff;
  }
`;
