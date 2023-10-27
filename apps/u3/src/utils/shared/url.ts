/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2023-02-01 13:15:52
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2023-02-02 17:10:57
 * @Description: file description
 */
export function getDomainNameByUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    const parts = host.split('.');
    if (parts.length > 1) {
      return parts.at(-2);
    }
    return host;
  } catch (error) {
    return '';
  }
}
