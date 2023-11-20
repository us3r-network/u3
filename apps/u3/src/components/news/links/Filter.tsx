/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-06 10:27:08
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-14 10:57:16
 * @Description: file description
 */
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import useConfigsTopics from '../../../hooks/shared/useConfigsTopics';
import CardBase from '../../common/card/CardBase';
import CheckboxMultiChoice from '../../common/checkbox/CheckboxMultiChoice';

export type FilterProps = {
  values: { channels: string[] };
  filterAction: (data: { channels: string[] }) => void;
};

export default function Filter({
  values,
  filterAction,
}: {
  values: { channels: string[] };
  filterAction: (data: { channels: string[] }) => void;
}) {
  const { topics } = useConfigsTopics();
  const { contentTags } = topics;
  return (
    <FilterWrapper>
      <CheckboxMultiChoice
        label="Tag"
        className="filter-multi-choice"
        options={contentTags.slice(0, 20).map((item) => ({
          value: item.value,
          label: item.name,
        }))}
        onChange={(value) => {
          filterAction({ ...values, channels: value });
        }}
        value={values.channels}
      />
    </FilterWrapper>
  );
}

const FilterWrapper = styled(CardBase)`
  border: none;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  ${isMobile &&
  `
    padding: 0px;
  `}
`;
