/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:07:48
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-26 14:17:56
 * @FilePath: /u3/apps/u3/src/hooks/farcaster/useLazyQueryFidWithAddress.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useLazyQuery } from '@airstack/airstack-react';
import { useMemo } from 'react';

export default function useLazyQueryFidWithAddress(address) {
  const query = `
  query MyQuery {
    Socials(
      input: {
        filter: {
          dappName: {_eq: farcaster},
          userAssociatedAddresses: {_eq: "${address}"}},
          blockchain: ethereum
        }
      ) {
      Social {
        userId
        userAddress
      }
    }
  }
  `;
  const [fetch, { data, loading, error }] = useLazyQuery(query);
  const { Social } = data?.Socials || {};
  console.log('Social', address, Social);
  // TODO 先对比userId 取最小的那个，后续返回fids
  const fid = useMemo(
    () =>
      Social?.reduce(
        (acc, cur) => (Number(acc.userId) < Number(cur.userId) ? acc : cur),
        {}
      )?.userId as string,
    [Social]
  );

  return { fetch, fid, loading, error };
}
