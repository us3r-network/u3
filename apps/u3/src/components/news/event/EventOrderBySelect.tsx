/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-01-09 17:01:13
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-01-09 17:49:59
 * @Description: file description
 */
import { OrderBy } from '../../../services/shared/types/common';
import Select, { SelectOption } from '../../common/select/Select';
import OrderBySvg from '../../common/assets/svgs/activity-heart.svg';

const orderByOptions: Array<SelectOption> = [
  {
    value: OrderBy.FORU,
    label: 'For U',
  },
  {
    value: OrderBy.NEWEST,
    label: 'Newest',
  },
  {
    value: OrderBy.EARLIEST,
    label: 'Earliest',
  },
  {
    value: OrderBy.TRENDING,
    label: 'Trending',
  },
];
export const defaultEventOrderBy = orderByOptions[0].value;
type EventOrderBySelectProps = {
  value: '' | OrderBy;
  onChange: (value: OrderBy) => void;
};
export default function EventOrderBySelect({
  value = defaultEventOrderBy,
  onChange,
}: EventOrderBySelectProps) {
  return (
    <Select
      options={orderByOptions}
      onChange={(v) => onChange(v)}
      value={value}
      iconUrl={OrderBySvg}
    />
  );
}
