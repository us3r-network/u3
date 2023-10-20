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
  // TODO 先对比userId 取最小的那个，后续返回fids
  const fid = useMemo(
    () =>
      Social?.reduce(
        (acc, cur) => (Number(acc.userId) < Number(cur.userId) ? acc : cur),
        {}
      )?.userId,
    [Social]
  );

  return { fetch, fid, loading, error };
}
