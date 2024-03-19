/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-06-16 16:58:21
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-23 19:15:13
 * @FilePath: /u3/apps/u3/src/utils/shortPubKey.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function shortPubKey(
  key: string,
  ops?: { len?: number; split?: string }
) {
  if (!key) return '';
  const split = ops?.split;
  const len = ops?.len || 4;

  if (split) {
    return key.slice(0, len) + split + key.slice(-len);
  }
  return key.slice(0, len + 2) + '..'.repeat(len / 4) + key.slice(-len);
}

export function shortPubKeyHash(hashKey: string) {
  const arr = hashKey.split(':');
  const pubkey = arr.pop();
  if (pubkey) {
    const shortKey = shortPubKey(pubkey);
    arr.push(shortKey);
    return arr.join(':');
  }
  return shortPubKey(hashKey);
}
