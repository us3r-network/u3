/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-07-01 18:09:56
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-08-25 16:55:54
 * @Description: solana 相关工具方法
 */

export function sortPubKey(key: string, len = 4) {
  return key.slice(0, len) + '..'.repeat(len / 4) + key.slice(-len);
}
