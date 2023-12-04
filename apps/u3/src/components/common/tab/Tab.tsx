/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 09:46:01
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-04 13:04:21
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';

type TabOption = {
  value: any;
  label: string | JSX.Element;
  icon?: string;
};
type Props = StyledComponentPropsWithRef<'div'> & {
  options: TabOption[];
  value: any;
  onChange?: (value: string) => void;
};
export default function Tab({ options, value, onChange, ...divProps }: Props) {
  return (
    <TabWrapper {...divProps}>
      {options.map(({ label, value: v, icon }) => (
        <TabOptionItem
          key={v}
          isActive={v === value}
          onClick={() => onChange && onChange(v)}
          className="tab-option-item"
        >
          {icon && <img src={icon} alt="" />}
          {label}
        </TabOptionItem>
      ))}
    </TabWrapper>
  );
}
const TabWrapper = styled.div`
  width: 100%;
  height: 70px;
  border-bottom: 1px solid #39424c;
  display: flex;
  gap: 32px;
  /* justify-content: center; */
  align-items: center;
  overflow-x: scroll;
`;
const TabOptionItem = styled.div<{ isActive?: boolean }>`
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  font-weight: 500;
  font-size: 18px;
  line-height: 18px;
  color: ${(props) => (props.isActive ? '#FFFFFF' : '#718096')};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  img {
    width: 20px;
    height: 20px;
  }
  transition: all 0.2s ease-in-out;
  ${(props) =>
    props.isActive &&
    `
    border-bottom: 3px solid #fff;
  `};
`;
