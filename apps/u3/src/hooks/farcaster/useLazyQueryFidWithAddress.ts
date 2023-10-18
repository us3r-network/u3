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
  const fid = useMemo(
    () => Social?.find((item) => item.userAddress === address)?.userId,
    [Social]
  );

  return { fetch, fid, loading, error };
}
