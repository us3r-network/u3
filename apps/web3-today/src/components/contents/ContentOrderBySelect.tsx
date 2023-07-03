/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-16 14:18:38
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-03 16:54:47
 * @Description: file description
 */
import Select, { SelectOption } from '../common/select/Select';
import OrderBySvg from '../common/icons/svgs/activity-heart.svg';
import { OrderBy } from '../../services/types/common';

const orderByOptions: Array<SelectOption> = [
  {
    value: OrderBy.FORU,
    label: 'For U',
  },
  {
    value: OrderBy.TRENDING,
    label: 'Trending',
  },
  {
    value: OrderBy.NEWEST,
    label: 'Mempool',
  },
];
export const defaultContentOrderBy = orderByOptions[0].value;
type ContentOrderBySelectProps = {
  value: '' | OrderBy;
  onChange: (value: OrderBy) => void;
};
export default function ContentOrderBySelect({
  value = defaultContentOrderBy,
  onChange,
}: ContentOrderBySelectProps) {
  return (
    <Select
      options={orderByOptions}
      onChange={(v) => onChange(v)}
      value={value}
      iconUrl={OrderBySvg}
    />
  );
}
