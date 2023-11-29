/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-16 14:18:38
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-11-24 19:20:15
 * @Description: file description
 */
import Select, { SelectOption } from '../../common/select/Select';
import OrderBySvg from '../../common/assets/svgs/activity-heart.svg';
import { OrderBy } from '../../../services/shared/types/common';

const orderByOptions: Array<SelectOption> = [
  // {
  //   value: OrderBy.FORU,
  //   label: 'For U',
  // },
  {
    value: OrderBy.TRENDING,
    label: 'Trending',
  },
  {
    value: OrderBy.NEWEST,
    label: 'Newest',
  },
];
export const defaultLinkOrderBy = orderByOptions[0].value;
type LinkOrderBySelectProps = {
  value: '' | OrderBy;
  onChange: (value: OrderBy) => void;
};
export default function LinkOrderBySelect({
  value = defaultLinkOrderBy,
  onChange,
}: LinkOrderBySelectProps) {
  return (
    <Select
      options={orderByOptions}
      onChange={(v) => onChange(v)}
      value={value}
      iconUrl={OrderBySvg}
    />
  );
}
