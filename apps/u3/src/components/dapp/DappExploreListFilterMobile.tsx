/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-28 23:40:40
 * @Description: file description
 */
import { useMemo } from 'react';
import styled from 'styled-components';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { DappExploreListParams } from '../../services/types/dapp';
import CheckboxMultiChoice from '../common/checkbox/CheckboxMultiChoice';

export type DappExploreListFilterMobileValues = Pick<
  DappExploreListParams,
  'chains' | 'types'
>;

export const defaultDappExploreListFilterMobileValues: DappExploreListFilterMobileValues =
  {
    chains: [],
    types: [],
  };
type DappExploreListFilterMobileProps = {
  values: DappExploreListFilterMobileValues;
  onChange: (values: DappExploreListFilterMobileValues) => void;
};
export default function DappExploreListFilterMobile({
  values,
  onChange,
}: DappExploreListFilterMobileProps) {
  const { topics } = useConfigsTopics();
  const chainOptions = useMemo(
    () =>
      topics.chains.map((item) => ({
        value: item.chainEnum,
        label: item.name,
        iconUrl: item.image,
      })),
    [topics]
  );
  const typeOptions = useMemo(
    () =>
      topics.dappTypes.map((item) => ({
        value: item.value,
        label: item.name,
      })),
    [topics]
  );
  const { types, chains } = values;
  return (
    <DappExploreListFilterMobileWrapper>
      <CheckboxMultiChoice
        label="Type"
        options={typeOptions}
        onChange={(value) => onChange({ ...values, types: value })}
        value={types}
      />
      <CheckboxMultiChoice
        label="Chains"
        options={chainOptions}
        onChange={(value) => onChange({ ...values, chains: value })}
        value={chains}
      />
    </DappExploreListFilterMobileWrapper>
  );
}
const DappExploreListFilterMobileWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
