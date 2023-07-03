/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-28 15:36:41
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-19 10:42:47
 * @Description: file description
 */
// Omit intermediate strings
export const omitIntermediateStr = (
  str: string,
  preNum: number,
  afterNum: number,
  symbolNum?: number
) => {
  const len = str.length;
  const front = str.substring(0, preNum);
  const back = str.substring(len - afterNum, len);
  const repeatNum = symbolNum || len - preNum - afterNum;
  return `${front}${'*'.repeat(repeatNum)}${back}`;
};

export const capitalizeFirstLetter = (str: string) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
