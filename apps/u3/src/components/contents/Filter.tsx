/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-06 10:27:08
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-07 11:01:04
 * @Description: file description
 */
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import useConfigsTopics from '../../hooks/useConfigsTopics';
import { ContentLangRev } from '../../services/types/contents';
import CardBase from '../common/card/CardBase';
import CheckboxMultiChoice from '../common/checkbox/CheckboxMultiChoice';

export default function Filter({
  values,
  filterAction,
}: {
  values: { tags: string[]; lang: string[] };
  filterAction: (data: { tags: string[]; lang: string[] }) => void;
}) {
  const { topics } = useConfigsTopics();
  const { langs, contentTags } = topics;
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
          filterAction({ ...values, tags: value });
        }}
        value={values.tags}
      />
      <CheckboxMultiChoice
        label="Language"
        className="filter-multi-choice"
        options={langs
          .map((item) => {
            if (item.value === 'EN') {
              return {
                value: item.value,
                label: ContentLangRev.EN,
              };
            }
            if (item.value === 'CN') {
              return {
                value: item.value,
                label: ContentLangRev.CN,
              };
            }
            return null;
          })
          .filter((item) => !!item)}
        onChange={(value) => {
          filterAction({ ...values, lang: value });
        }}
        value={values.lang}
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
