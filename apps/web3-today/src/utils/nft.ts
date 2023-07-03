/*
 * @Author: shixuewen friendlysxw@163.com
 * @Date: 2022-09-27 16:17:40
 * @LastEditors: shixuewen friendlysxw@163.com
 * @LastEditTime: 2022-09-27 16:21:11
 * @Description: file description
 */
export const DEFAULT_NFT_COLLECTION_URI = 'https://looksrare.org/collections/';
export const getNftCollectionUrl = (contractAddress: string) => {
  return DEFAULT_NFT_COLLECTION_URI + contractAddress;
};
