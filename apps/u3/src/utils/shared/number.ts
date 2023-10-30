/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-05 11:53:45
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-10-09 13:18:18
 * @Description: file description
 */
export enum UnitStringCriticalNumber {
  w = 100000,
  k = 1000,
}
export const formatNumberToUnitString = (num: number): string | number => {
  const toFixed = (number: number) => number.toFixed(1);
  if (num > UnitStringCriticalNumber.w) {
    return `${toFixed(num / 10000)}w`;
  }
  if (num > UnitStringCriticalNumber.k) {
    return `${toFixed(num / 1000)}k`;
  }
  return num;
};
