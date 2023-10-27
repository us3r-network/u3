/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-14 12:43:01
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-12-26 15:49:17
 * @Description: file description
 */
import React, { useEffect, useRef, useState } from 'react';
import { StyledComponentPropsWithRef } from 'styled-components';
import { getAllPlatform } from '../../../services/shared/api/common';
import Select, { SelectOption } from '../../common/select/Select';
import PlatformSvg from '../../common/assets/svgs/cube.svg';

type ValueType = string | number;
type Props = StyledComponentPropsWithRef<'div'> & {
  value: ValueType;
  onChange?: (value: ValueType) => void;
  onSelectOption?: (option: SelectOption) => void;
};
const optionAll = {
  value: '',
  label: 'All Platform',
};
export default function PlatformFilter({
  value,
  onChange,
  onSelectOption,
}: Props) {
  const [options, setOptions] = useState<SelectOption[]>([optionAll]);
  useEffect(() => {
    getAllPlatform().then((resp) =>
      setOptions([
        optionAll,
        ...resp.data.data.map((item) => ({
          value: item.platform,
          label: item.platform,
          iconUrl: item.platformLogo,
        })),
      ])
    );
  }, []);
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      onSelectOption={onSelectOption}
      iconUrl={PlatformSvg}
    />
  );
}
