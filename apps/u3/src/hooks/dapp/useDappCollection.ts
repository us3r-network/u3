/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-10-20 19:08:17
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-10-30 13:11:42
 * @FilePath: /u3/apps/u3/src/hooks/dapp/useDappCollection.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from 'react';
import { debounce, isEqual, uniqBy } from 'lodash';
import { ZDK } from '@zoralabs/zdk';
import {
  zora1155ToMintAddress,
  zoraDappsNetworkInfo,
  ZORA_API_ENDPOINT,
  ziraChainId,
  // ZORA_API_KEY,
} from '../../constants/zora';
// import { getMyDappCollectionNFT } from '../../api/chainbase';
import { fetchDappByTokenId } from '../../services/dapp/api/dapp';

const args = {
  endPoint: ZORA_API_ENDPOINT,
  networks: [zoraDappsNetworkInfo],
  // apiKey: ZORA_API_KEY,
};
export const zdk = new ZDK(args);

export type ZoraNFT = {
  chainId: number;
  contractAddress: string;
  tokenId: number;
  dapp?: any;
};

export default function useDappCollection(owner: string | null) {
  const [dappCollection, setDappCollection] = useState([]);
  const [loading, setLoading] = useState(false);
  const load = () => {
    if (!owner) return;
    // console.log('load dapp collection: ', owner);
    setLoading(true);
    try {
      const nfts = getZoraNFTFromLocalStorage();
      // console.log('nfts: ', nfts);
      const dappNtfs = nfts.filter(
        (item) =>
          Number(item.chainId) === Number(ziraChainId) &&
          item.contractAddress === zora1155ToMintAddress
      );
      // console.log('dappNtfs from load: ', dappNtfs);
      setDappCollection(dappNtfs.map((nft) => nft.dapp));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const save = async (nfts: ZoraNFT[]) => {
    const newNfts = await Promise.all(
      nfts.map(async (nft) => {
        if (!nft.dapp || !nft.dapp.id) {
          const resp = await fetchDappByTokenId(nft.tokenId);
          nft.dapp = resp.data.data;
        }
        return nft;
      })
    );
    console.log('save nfts: ', newNfts);
    setZoraNFTToLocalStorage(newNfts);
  };

  const append = async (newNfts: ZoraNFT[]) => {
    // console.log('append new nfts: ', newNfts);
    const localNfts = getZoraNFTFromLocalStorage();
    const nfts = uniqBy([...localNfts, ...newNfts], (item) => item.tokenId);
    // console.log('compare nfts: ', localNfts, nfts);
    if (isEqual(localNfts, nfts)) return;
    await save(nfts);
    window.dispatchEvent(new Event(MINT_NFT_EVENT_NAME));
    load();
  };

  const sync = async () => {
    if (!owner) return;
    // console.log('sync dapp collection: ', owner);
    setLoading(true);
    try {
      // chainbase方案：目前不支持测试网络，另外chainbase的web3 api有10几秒的延迟，不适合实时性要求高的场景
      // const resp = await getMyDappCollectionNFT({
      //   chain_id: ziraChainId,
      //   address: owner,
      //   contract_address: zora1155ToMintAddress,
      // });
      // const collection = resp.data.data.filter(
      //   (token) => Number(token.token_id) !== 1
      // );
      // console.log('dapp collection nft: ', resp, collection);

      // console.log('localNfts: ', localNfts);
      const MY_TOKENS_QUERY = {
        where: {
          collectionAddresses: [zora1155ToMintAddress],
          ownerAddresses: [owner],
        },
        pagination: { limit: 100 }, // Optional, limits the response size to 3 NFTs
        includeFullDetails: true, // Optional, provides more data on the NFTs such as events
        includeSalesHistory: false, // Optional, provides sales data on the NFTs
      };
      const resp = await zdk.tokens(MY_TOKENS_QUERY);
      if (resp.tokens.nodes) {
        const collection = (resp?.tokens?.nodes as unknown as any[]).map(
          (item) => item.token
        );
        // console.log('collection: ', collection);
        const remoteNfts = collection
          .map((item) => {
            return {
              chainId: item.tokenContract.chain,
              contractAddress: item.tokenContract.collectionAddress,
              tokenId: Number(item.tokenId),
            };
          })
          .filter((item) => item.tokenId !== 1);
        // console.log('remoteNfts: ', remoteNfts);
        append(remoteNfts);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const MINT_NFT_EVENT_NAME = 'addNFT';
  const storageHandler = () => {
    // console.log('addNFT Handler: ', e);
    load();
  };
  useEffect(() => {
    debounce(load, 500)();
    window.addEventListener(MINT_NFT_EVENT_NAME, storageHandler);
    // remember to remove the listener
    return () =>
      window.removeEventListener(MINT_NFT_EVENT_NAME, storageHandler);
  }, [owner]);

  return {
    load,
    append,
    sync,
    loading,
    dappCollection,
  };
}

export const ZORA_NFT_LOCAL_STORAGE_KEY = 'zora_nft';
const getZoraNFTFromLocalStorage = (): ZoraNFT[] => {
  const nfts = localStorage.getItem(ZORA_NFT_LOCAL_STORAGE_KEY);
  if (!nfts) return [];
  return JSON.parse(nfts);
};

const setZoraNFTToLocalStorage = (nfts: ZoraNFT[]) => {
  localStorage.setItem(ZORA_NFT_LOCAL_STORAGE_KEY, JSON.stringify(nfts));
};
