/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-20 11:03:21
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-11 15:48:21
 * @Description: file description
 */
import styled, { StyledComponentPropsWithRef } from 'styled-components';
import { Reward } from '../../services/types/common';
import Tag from '../common/tag/Tag';

const bgcMaps = {
  [Reward.WL]: '#B57856',
  [Reward.BADGE]: '#6C8FC1',
  [Reward.TOKEN]: '#56B59E',
  [Reward.NFT]: '#A86ECB',
};
type Props = StyledComponentPropsWithRef<'div'> & {
  value: Reward;
};
export default function RewardTag({ value, ...otherProps }: Props) {
  const bgc = bgcMaps[value] || '#718096';
  return (
    <RewardTagWrapper bgc={bgc} {...otherProps}>
      {value}
    </RewardTagWrapper>
  );
}
const RewardTagWrapper = styled(Tag)<{ bgc: string }>`
  width: fit-content;
  background-color: ${({ bgc }) => bgc};
`;
