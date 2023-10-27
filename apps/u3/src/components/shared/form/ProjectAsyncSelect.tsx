/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 12:43:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-27 16:14:13
 * @Description: file description
 */
import { StyledComponentPropsWithRef } from 'styled-components';
import { fetchListForProjectExplore } from '../../../services/shared/api/project';
import { OrderBy } from '../../../services/shared/types/common';
import AsyncSelect, {
  AsyncSelectV2,
  Option,
} from '../../common/select/AsyncSelect';

type ValueType = string | number;
type Props = StyledComponentPropsWithRef<'div'> & {
  value: ValueType;
  onChange?: (value: ValueType) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onSelectOption?: (option: Option) => void;
  disabled?: boolean;
};

const getProjectOptions = (keywords: string) => {
  // TODO 暂时先取TRENDING的前50条，后期要有一个获取所有project的接口
  const params = {
    orderBy: OrderBy.TRENDING,
    pageSize: 50,
    pageNumber: 0,
    keywords,
  };
  return fetchListForProjectExplore(params).then((resp) => resp.data.data);
};

export default function ProjectAsyncSelect({
  value,
  onChange,
  onSelectOption,
  disabled,
}: Props) {
  return (
    <AsyncSelect
      disabled={disabled}
      value={value}
      onChange={onChange}
      onSelectOption={onSelectOption}
      getOptions={getProjectOptions}
    />
  );
}

export function ProjectAsyncSelectV2({ value, onChange, disabled }: Props) {
  return (
    <AsyncSelectV2
      disabled={disabled}
      value={value}
      onChange={onChange}
      getOptions={getProjectOptions}
    />
  );
}
