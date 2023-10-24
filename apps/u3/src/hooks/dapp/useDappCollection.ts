/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-24 17:55:25
 * @FilePath: /u3/apps/u3/src/hooks/dapp/useDappCollection.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { ZDK } from '@zoralabs/zdk';
import {
  zora1155ToMintAddress,
  zoraDappsNetworkInfo,
  ZORA_API_ENDPOINT,
  // ZORA_API_KEY,
} from '../../constants/zora';

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [zoraDappsNetworkInfo],
  // apiKey: ZORA_API_KEY,
};
export const zdk = new ZDK(args);

export default function useDappCollection(owner: string | null) {
  const [dappCollection, setDappCollection] = useState([]);
  const [loading, setLoading] = useState(false);

  const MY_TOKENS_QUERY = {
    where: {
      collectionAddresses: [zora1155ToMintAddress],
      ownerAddresses: [owner],
    },
    pagination: { limit: 100 }, // Optional, limits the response size to 3 NFTs
    includeFullDetails: true, // Optional, provides more data on the NFTs such as events
    includeSalesHistory: false, // Optional, provides sales data on the NFTs
  };

  const update = async () => {
    if (!owner) return;
    setLoading(true);
    try {
      const resp = await zdk.tokens(MY_TOKENS_QUERY);
      if (resp.tokens.nodes) {
        const collection = (resp?.tokens?.nodes as unknown as any[]).map(
          (item) => item.token
        );
        setDappCollection(collection);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    debounce(update, 500)();
  }, [owner]);

  return {
    loading,
    dappCollection,
    updateDappCollection: update,
  };
}
