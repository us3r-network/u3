/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-05 14:33:02
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-17 16:47:42
 * @Description: file description
 */
import { useMemo } from 'react';
import styled from 'styled-components';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { DappExploreListParams } from '../../services/types/dapp';
import SearchInput from '../common/input/SearchInput';
import GridSvgUrl from '../common/icons/svgs/grid2.svg';
import ListChoice from '../common/select/ListChoice';

export type DappExploreListFilterValues = Pick<
  DappExploreListParams,
  'chains' | 'types' | 'keywords'
>;

export const defaultChainOption = {
  value: '',
  label: 'All Chains',
  iconUrl: GridSvgUrl,
};
export const defaultTypeOption = {
  value: '',
  label: 'All Categories',
  iconUrl: GridSvgUrl,
};

export const defaultDappExploreListFilterValues: DappExploreListFilterValues = {
  chains: [defaultChainOption.value],
  types: [defaultTypeOption.value],
  keywords: '',
};
type DappExploreListFilterProps = {
  values: DappExploreListFilterValues;
  onChange: (values: DappExploreListFilterValues) => void;
};
export default function DappExploreListFilter({
  values,
  onChange,
}: DappExploreListFilterProps) {
  const { topics } = useConfigsTopics();
  const chainOptions = useMemo(
    () => [
      defaultChainOption,
      ...topics.chains.map((item) => ({
        value: item.chainEnum,
        label: item.name,
        iconUrl: item.image,
      })),
    ],
    [topics]
  );
  const typeOptions = useMemo(
    () => [
      defaultTypeOption,
      ...topics.dappTypes.map((item) => ({
        value: item.value,
        label: item.name,
        iconUrl: item.image,
      })),
    ],
    [topics]
  );
  const { types, chains, keywords } = values;
  return (
    <DappExploreListFilterWrapper>
      {/* <Search onSearch={(value) => onChange({ ...values, keywords: value })} /> */}

      <ListChoice
        label="Categories"
        options={typeOptions}
        onChange={(value) => onChange({ ...values, types: [value] })}
        value={types[0] ?? defaultTypeOption.value}
      />
      <ListChoice
        label="Blockchains"
        options={chainOptions}
        onChange={(value) => onChange({ ...values, chains: [value] })}
        value={chains[0] ?? defaultChainOption.value}
      />
    </DappExploreListFilterWrapper>
  );
}
const DappExploreListFilterWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;
const Search = styled(SearchInput)`
  max-width: 400px;
`;
