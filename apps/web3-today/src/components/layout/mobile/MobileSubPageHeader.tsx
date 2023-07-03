/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-12-29 18:44:14
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-03-02 09:39:48
 * @Description: file description
 */
import { useEffect, useState } from 'react';

import MobileHeaderLayout from './MobileHeaderLayout';

export default function MobileSubPageHeader({ name }: { name: string }) {
  return <MobileHeaderLayout name={name} />;
}
