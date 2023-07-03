/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 17:23:19
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 15:31:51
 * @Description: file description
 */
import styled from 'styled-components';
import InputBase, { Props } from '../input/InputBase';
import ChevronDownSvg from '../icons/svgs/chevron-down.svg';

const defaultProps = {
  type: 'datetime-local',
};
export default function TimePicker(props: Props) {
  const newProps = { ...defaultProps, ...props };
  return <TimePickerWrapper {...newProps} />;
}
const TimePickerWrapper = styled(InputBase)`
  height: 48px;
  padding: 12px 16px;
  ::-webkit-calendar-picker-indicator {
    margin: 0;
    padding: 0;
    margin-top: 10px;
    background-image: url(${ChevronDownSvg});
    color: #718096;
    cursor: pointer;
  }
`;
