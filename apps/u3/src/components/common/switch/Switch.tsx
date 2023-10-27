/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-13 16:30:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-12 15:30:06
 * @Description: file description
 */
import ReactSwitch, { ReactSwitchProps } from 'react-switch';
import styled from 'styled-components';
import CheckSvg from '../assets/svgs/check.svg';

export type Props = ReactSwitchProps;
const SwitchIconBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CheckedIcon = styled.img`
  width: 12px;
  height: 12px;
`;
const defaultProps = {
  uncheckedIcon: false,
  checkedIcon: (
    <SwitchIconBox>
      <CheckedIcon src={CheckSvg} />
    </SwitchIconBox>
  ),
  onColor: '#cd62ff',
  width: 44,
  height: 24,
  handleDiameter: 18,
};
export default function Switch(props: ReactSwitchProps) {
  const newProps = { ...defaultProps, ...props };
  return <ReactSwitch {...newProps} />;
}
