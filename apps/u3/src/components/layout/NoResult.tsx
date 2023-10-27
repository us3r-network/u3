/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-23 16:58:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-23 17:07:13
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import NoResultSvg from '../common/assets/imgs/no-result.svg';

export type NoResultProps = StyledComponentPropsWithRef<'div'>;
export default function NoResult({ ...divProps }: NoResultProps) {
  return (
    <NoResultWrapper {...divProps}>
      <NoResultImg src={NoResultSvg} />
      <NoResultDesc>No Result</NoResultDesc>
    </NoResultWrapper>
  );
}
const NoResultWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;
const NoResultImg = styled.img`
  width: 100px;
  height: 100px;
`;
const NoResultDesc = styled.span`
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  text-align: center;
  color: #748094;
`;
