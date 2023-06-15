/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-03-02 11:59:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 12:24:29
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { SectionTitle } from './SectionTitle';

type Props = StyledComponentPropsWithRef<'div'> & {
  text: string;
};

export function IntroductionMobile({ text, ...otherProps }: Props) {
  return (
    <Wrapper {...otherProps}>
      <SectionTitle>Introduction</SectionTitle>
      <Text>{text}</Text>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
`;
const Text = styled.span`
  display: block;
  margin-top: 10px;
  font-weight: 400;
  font-size: 14px;
  line-height: 17px;
  color: #718096;

  opacity: 0.8;
`;
